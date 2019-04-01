# Mapbox Test App

This repository is an attempt to translate the Mapbox Native GL Android example app 
(available here: https://github.com/Yermo/MapboxTest ) into a Nativescript Android app. 

It was initially created using 

```
tns create [<App Name>] --ng [--path <Directory>] [--appid <App ID>]" 
```

and as such has some extraneous sample code. 

It creates an android activity in src/app/activity.android.ts which is referenced from App_Resources/Android/src/main/AndroidManifest.xml.

App_Resources/Android/app.gradle has been updated to reflect what was in the build.gradle file in the referenced native Java example app.

It is not perfect. It uses an ugly timeout in onCreate() to wait for the view heirarchy to build and it currently overwrites the entire
screen but so far I have not been able to get it to crash onPause/onResume. 

You will need Nativescript installed and a Mapbox Access Token in order to run it.

$ tns run android 
