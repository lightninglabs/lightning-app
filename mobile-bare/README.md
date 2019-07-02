Lightning mobile app
==========

## Getting started

This project was bootstrapped using [Expo CLI as a bare project](https://blog.expo.io/you-can-now-use-expo-apis-in-any-react-native-app-7c3a93041331). You should only need `react-native-cli` for development not `expo-cli`. See the [React Native CLI Getting Started Guide](https://facebook.github.io/react-native/docs/getting-started.html)

## Building lnd

### Build dependencies

* node 10 LTS
* react-native-cli (npm install -g react-native-cli)
* cocoapods 1.7.2
* go 1.11.6
* [gomobile](https://github.com/golang/go/wiki/Mobile)
* [lnd mobile build tools](https://github.com/lightninglabs/lnd/tree/mobile-build-tool)

### Building

```
go get golang.org/x/mobile/cmd/gomobile
cd lnd
make clean
gomobile init
make mobile
```

Next copy the lnd mobile binaries to this project

1. `lnd/mobile/build/ios/Lndmobile.framework` -> `ios/lightning`
2. `lnd/mobile/build/android/Lndmobile.aar` -> `android/Lndmobile`

## Running the app

### Install the dependencies

```
npm install
cd ios
pod install
cd ..
```

### Start the app in the simulator

```
npm run ios
npm run android
```

### Debugging the app in Xcode or Android Studio

Start the metro development server

```
npm start
```

Then just open `ios/LightningApp.xcworkspace` from the finder on your mac. Or open the project in the `android` directory in Android Studio.

## Releasing

### iOS

1. Open `ios/LightningApp.xcworkspace` from the finder on your mac
2. From xcode set the active scheme to `Release`
3. Set the build target as `Generic iOS device`
4. Bump the version and build number in the project
5. Build the Archive in the menu under `Product -> Archive`

### Android

1. Open Android Studio
2. open the project in the `android` directory
3. Bump the `versionName` and `versionCode` under `app/build.gradle`
4. From the menu `Build -> Clean Project`
5. From the menu `Build -> Generate Signed Bundle / APK`
