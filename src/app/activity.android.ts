/**
*
* @link https://github.com/NativeScript/android-runtime/issues/981
*/

import {setActivityCallbacks, AndroidActivityCallbacks} from "tns-core-modules/ui/frame";

import * as application from "tns-core-modules/application";

declare const com, java, org;

@JavaProxy("com.amapboxtest.MainActivity")
class Activity extends android.support.v7.app.AppCompatActivity {
    public isNativeScriptActivity;

    private _callbacks: AndroidActivityCallbacks;

    private mapView: any;

    public onCreate(savedInstanceState: android.os.Bundle): void {

      console.log( "Activity::onCreate()" );

      // Set the isNativeScriptActivity in onCreate (as done in the original NativeScript activity code)
      // The JS constructor might not be called because the activity is created from Android.

      this.isNativeScriptActivity = true;

      if (!this._callbacks) {
        setActivityCallbacks(this);
      }

      this._callbacks.onCreate(this, savedInstanceState, super.onCreate );

      console.log( "Activity::onCreate(): after _callbacks.onCreate()" );

      let layout;
      let resourceId;

      console.log( "Activity::onCreate(): before getting layout" );

      // this fails.

      try {
        layout = this.getResources().getIdentifier( "activity_main", "layout", this.getPackageName() );
      } catch( e ) {
        console.error( "Unable to get layout:", e );
        throw e;
      }

      this.setContentView(layout);

      console.log( "Activity::onCreate(): before getting resourceId" );

      try {
        resourceId = this.getResources().getIdentifier( "mapView", "id", this.getPackageName() );
      } catch( e ) {
        console.error( "Unable to get resourceId:", e );
        throw e;
      }

      this.mapView = this.findViewById( resourceId );

      console.log( "Activity::onCreate(): after findViewById()" );

      this.mapView.onCreate( savedInstanceState ); 

      console.log( "Activity::onCreate(): after this.mapView.onCreate( savedInstanceState" );

      com.mapbox.mapboxsdk.Mapbox.getInstance( application.android.context, 'SET_ACCESS_TOKEN_HERE' );

      console.log( "Activity::onCreate(): after getInstance()" );

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
              builder.fromUrl( Style.LIGHT )
            );
          } 
        })
      );

    } // end of onCreate()

    // -------------------------------------------------------

    public onSaveInstanceState(outState: android.os.Bundle): void {

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
