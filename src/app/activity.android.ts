/**
* Test NativeScript Android Activity
*
* @link https://github.com/NativeScript/android-runtime/issues/981
*/

// CONFIG:

const ACCESS_TOKEN : any = 'set access token here';

const mapStyle = com.mapbox.mapboxsdk.maps.Style.LIGHT;
// const mapStyle = 'URL of custom style';


// --------------------------------------------------------------------------------------
 
import { setActivityCallbacks, AndroidActivityCallbacks } from "tns-core-modules/ui/frame";
import { getViewById } from "tns-core-modules/ui/core/view";
import { View } from "tns-core-modules/ui/core/view";
import { ContentView } from "tns-core-modules/ui/content-view";

import * as frame from "tns-core-modules/ui/frame";
import * as utils from "tns-core-modules/utils/utils";

import * as application from "tns-core-modules/application";

declare const com, java, org;

@JavaProxy("com.amapboxtest.MainActivity")
class Activity extends android.support.v7.app.AppCompatActivity {
    public isNativeScriptActivity;

    private _callbacks: AndroidActivityCallbacks;

    private mapView: any;
    private mapViewLayout: any;

    // ----------------------------------------------------

    constructor() {
        super();
        return global.__native(this);
    }

    // ----------------------------------------------------

    public onCreate(savedInstanceState: android.os.Bundle): void {

      console.log( "Activity::onCreate()" );

      application.android.init( this.getApplication() );

      // Set the isNativeScriptActivity in onCreate (as done in the original NativeScript activity code)
      // The JS constructor might not be called because the activity is created from Android.

      this.isNativeScriptActivity = true;

      if (!this._callbacks) {
        setActivityCallbacks(this);
      }

      this._callbacks.onCreate(this, savedInstanceState, super.onCreate );

      console.log( "Activity::onCreate(): after _callbacks.onCreate()" );

      com.mapbox.mapboxsdk.Mapbox.getInstance( application.android.context, ACCESS_TOKEN );

      console.log( "Activity::onCreate(): after getInstance()" );

      // map options.

      const mapboxMapOptions = new com.mapbox.mapboxsdk.maps.MapboxMapOptions()
        .compassEnabled(false)
        .rotateGesturesEnabled(false)
        .scrollGesturesEnabled(true)
        .tiltGesturesEnabled(true)
        .zoomGesturesEnabled(true)
        .attributionEnabled(true)
        .logoEnabled(true);

      const cameraPositionBuilder = new com.mapbox.mapboxsdk.camera.CameraPosition.Builder()
        .zoom( 12 )
        .target(new com.mapbox.mapboxsdk.geometry.LatLng( 39.007846, -76.947041 ));
  
      mapboxMapOptions.camera( cameraPositionBuilder.build() );

      console.log( "Activity::onCreate(): after mapboxMapOptions()" );

      this.mapView = new com.mapbox.mapboxsdk.maps.MapView(
        application.android.context,
        mapboxMapOptions );

      console.log( "Activity::onCreate(): after MapView()" );

      this.mapView.onCreate( savedInstanceState ); 

      console.log( "Activity::onCreate(): after this.mapView.onCreate( savedInstanceState )" );

      // modelled after mapbox.android.ts in the Nativescript-Mapbox plugin.

      this.mapView.getMapAsync(
        new com.mapbox.mapboxsdk.maps.OnMapReadyCallback({
          onMapReady: mapboxMap => {

            console.log( "onMapReady()");

            this.mapView.addOnDidFinishLoadingStyleListener(
              new com.mapbox.mapboxsdk.maps.MapView.OnDidFinishLoadingStyleListener({
                onDidFinishLoadingStyle : style => {

                  console.log( "style loaded" );

                }
              })
            );

            let builder = new com.mapbox.mapboxsdk.maps.Style.Builder();

            const Style = com.mapbox.mapboxsdk.constants.Style;

            mapboxMap.setStyle( 
              builder.fromUrl( mapStyle )
            );

          return( { android: this.mapView } );

          } 
        })
      );

      console.log( "Activity::onCreate(): after getMapAsync()" );

      const topMostFrame = frame.topmost();

      console.log( "Activity::onCreate(): after topmost:", topMostFrame.width );

      const context = application.android.context;

      console.log( "Activity::onCreate(): after context:", context );

      // FIXME: This is a proof of concept hack. 
      //
      // at the time that onCreate() is called it seems that the view heirarchy is not
      // yet created. This causes topMostFrame.currentPage to be NULL in addition to causing 
      // getViewById.
      //
      // It /seems/ that saving and restoring the savedInstanceState is what is preventing 
      // the crash on Android. I have not yet figured out how to get the savedInstanceState 
      // in a component or plugin. 

      setTimeout( () => {

        console.log( "Activity::onCreate(): after timeout currentpage is ", topMostFrame.currentPage );

        // QUESTION: I can get the contentView but how can one dynamically insert the map layout 
        // into the view? 

        let contentView = <ContentView>getViewById( frame.topmost(), 'mapContainer' );

        console.log( "Activity::onCreate(): after contentView", contentView );

        this.mapViewLayout = new android.widget.FrameLayout( contentView._context );

        console.log( "Activity::onCreate(): after FrameLayout" );

        const density = utils.layout.getDisplayDensity();

        console.log( "Activity::onCreate(): after getDisplayDensity()" );

        const left = 5 * density;
        const right = 5 * density;
        const top = 5 * density;
        const bottom = 5 * density;

        // FIXME: it's a full screen map overwriting the other content because I don't know
        // how to add the mapView to the contentView dynamically.

        const viewWidth = topMostFrame.currentPage.android.getWidth();
        const viewHeight = topMostFrame.currentPage.android.getHeight();

        console.log( "Activity::onCreate(): contentView width '" + viewWidth + "' height '" + viewHeight + "'" );

        let params = new android.widget.FrameLayout.LayoutParams( viewWidth - left - right, viewHeight - top - bottom );

        console.log( "Activity::onCreate(): after LayoutParams()" );

        params.setMargins(left, top, right, bottom);
        this.mapView.setLayoutParams( params );

        console.log( "Activity::onCreate(): after setLayoutParams()" );

        this.mapViewLayout.addView( this.mapView );

        console.log( "Activity::onCreate(): after addView" );

        // FIXME:

        this.setContentView( this.mapViewLayout );

        console.log( "Activity::onCreate(): after addView()" );

      }, 2000 );

      console.log( "Activity::onCreate(): end" );

    } // end of onCreate()

    // -------------------------------------------------------

    public onSaveInstanceState( outState: android.os.Bundle ): void {

        console.log( "Activity::onSaveInstanceState()" );

        this._callbacks.onSaveInstanceState(this, outState, super.onSaveInstanceState);

        this.mapView.onSaveInstanceState( outState );

    }

    // -------------------------------------------------------

    public onStart(): void {

      console.log( "Activity::onStart()" );

      this._callbacks.onStart(this, super.onStart);

      this.mapView.onStart();

    }

    // -------------------------------------------------------

    public onStop(): void {

        console.log( "Activity::onStop()" );

        this._callbacks.onStop(this, super.onStop);

        this.mapView.onStop();
    }

    // -------------------------------------------------------

    public onDestroy(): void {

        console.log( "Activity::onDestroy()" );

        this._callbacks.onDestroy(this, super.onDestroy);

        this.mapView.onDestroy();
    }

    // -------------------------------------------------------

    public onBackPressed(): void {

        console.log( "Activity::onBackPressed()" );

        this._callbacks.onBackPressed(this, super.onBackPressed);
    }

    // -------------------------------------------------------

    public onRequestPermissionsResult(requestCode: number, permissions: Array<string>, grantResults: Array<number>): void {

        console.log( "Activity::onCRequestPermissionResult()" );

        this._callbacks.onRequestPermissionsResult(this, requestCode, permissions, grantResults, undefined /*TODO: Enable if needed*/);
    }

    // -------------------------------------------------------

    public onActivityResult(requestCode: number, resultCode: number, data: android.content.Intent): void {

        console.log( "Activity::onActivityResult()" );

        this._callbacks.onActivityResult(this, requestCode, resultCode, data, super.onActivityResult);
    }
}

// END
