# Non-working Mapbox Test App

This repository is an attempt to translate the Mapbox Native GL Android example app 
(available here: https://github.com/Yermo/MapboxTest ) into a Nativescript Android app. 

It was initially created using 

```
tns create [<App Name>] --ng [--path <Directory>] [--appid <App ID>]" 
```

and as such has some extraneous sample code. 

It creates an android activity in src/app/activity.android.ts which is referenced from App_Resources/Android/src/main/AndroidManifest.xml.

App_Resources/Android/app.gradle has been updated to reflect what was in the build.gradle file in the referenced native Java example app.

App_Resources/Android/src/main/res/layout/ has been copied over from the native app as well but it appears that NativeScript does not yet
support <android.support.constraint.ConstraintLayout ...> so I changed it to <android.widget.FameLayout ...> (which works in the java app).

The problem I am facing here is that this code currently generates an exception in activity.android.ts at the line:

```
layout = this.getResources().getIdentifier( "activity_main", "layout", this.getPackageName() );
```

```
System.err: java.lang.RuntimeException: Unable to start activity ComponentInfo{com.amapboxtest.nsmapboxtest/com.amapboxtest.MainActivity}: com.tns.NativeScriptException: 
System.err: Calling js method onCreate failed
System.err: 
System.err: Error: android.view.InflateException: Binary XML file line #9: Binary XML file line #12: Error inflating class com.mapbox.mapboxsdk.maps.MapView
System.err: Caused by: android.view.InflateException: Binary XML file line #12: Error inflating class com.mapbox.mapboxsdk.maps.MapView
System.err: Caused by: java.lang.reflect.InvocationTargetException
```

This repository is in support of a StackoverFlow question.

You will need Nativescript installed and a Mapbox Access Token in order to run it.

$ tns run android 
