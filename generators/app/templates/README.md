# <%= productName %> Flutter app

## Setup instructions

### Prepare codebase

Firebase libraries require higher minimum Android SDK and iOS platform versions.

For Android:

Edit `android/app/build.gradle`. Change the minSdkVersion setting in `defaultConfig` so that it looks like this:

```
defaultConfig {
    // ...
    minSdkVersion 21
    // ...
}
```

For iOS:

Edit `ios/Podfile` and uncomment the following line:

```
# Uncomment this line to define a global platform for your project
platform :ios, '11.0'
```

### Get Dart dependencies

```
flutter pub get
```

### Use Flutterfire CLI to configure the Flutter app to connect to your Firebase project

Install both the Firebase CLI if you haven't already and log-in:

```
npm install -g firebase-tools
firebase login
```

And also install the FlutterFire CLI if you haven't already:

```
dart pub global activate flutterfire_cli
```

Finally run the following `flutterfire` command to configure Flutter to connect to your Firebase project:

```
flutterfire configure -p <%= firebaseProject %> -a <%= firebaseAppId %> -i <%= firebaseAppId %> --platforms ios,android
```

After this command has finished running don't forget to commit its outputs!

### Build generated files for the first time

The Flutter app depends on generated code for data models and localization. For the app to build successfully we need to generate them for the first time using the following command:

```
flutter pub run build_runner build --delete-conflicting-outputs
```

### Done!

Now you are ready to build and run the Flutter app for the first time 🚀

## Development

TODO: describe local and remote firebase development here
TODO: describe build_runner watch
