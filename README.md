# Non-working Mapbox Test App

This repository is an attempt to translate the Mapbox Native GL Android example app 
(available here: https://github.com/Yermo/MapboxTest ) into a Nativescript Android app. 

It is currently not working and generates an exception that I do not yet understand:

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
