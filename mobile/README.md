Lightning mobile app
==========

## Getting started

This project was bootstrapped using [Expo CLI as a bare project](https://blog.expo.io/you-can-now-use-expo-apis-in-any-react-native-app-7c3a93041331). You should only need `react-native-cli` for development not `expo-cli`. See the [React Native CLI Getting Started Guide](https://facebook.github.io/react-native/docs/getting-started.html)

## Checking build dependencies

Ensure you have all the following dependencies installed for a complete development environment

* node 10 LTS (`brew install node@10`)
* react-native-cli (`npm install -g react-native-cli`)
* watchman (`brew install watchman`)
* go 1.11.x (`brew install go@1.11`)
* protoc (`brew install protobuf`)
* [gomobile](https://github.com/golang/go/wiki/Mobile) (`go get -u golang.org/x/mobile/cmd/gomobile`)
* falafel (`go get -u github.com/halseth/falafel`)

_Required for iOS_
* Xcode
* cocoapods 1.7.2 (`brew install cocoapods`)

_Required for Android_
* [Java](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [Android Studio](https://developer.android.com/studio)
* [Android NDK](https://developer.android.com/ndk/guides)

## Building lnd

Before running the app, we will build mobile binaries for `lnd` so GRPC calls can be made during runtime. Check that your version of lnd (v0.8.0+) includes the lnd mobile build tools added in [this PR](https://github.com/lightningnetwork/lnd/pull/3282). Then from the `lnd` project root run:

```
make clean
gomobile init
```

Build the binaries for each platform
```
make ios        // only iOS
make android    // only Android
make mobile     // both iOS + Android
```

Next clone this project `git clone https://github.com/lightninglabs/lightning-app` and copy the `lnd` mobile binaries over to their respective directories:

1. `lnd/mobile/build/ios/Lndmobile.framework` -> `lightning-app/mobile/ios/lightning`
2. `lnd/mobile/build/android/Lndmobile.aar` -> `lightning-app/mobile/android/Lndmobile`

## Running the app

### Install dependencies

From the `/lightning-app` project root run

```
npm install
cd mobile
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

### Debug the app in Xcode or Android Studio

Start the metro development server

```
npm start
```

Then just open `ios/LightningApp.xcworkspace` in Xcode, or open the project in the `android` directory in Android Studio.

## Generating release builds

### iOS

1. Open `ios/LightningApp.xcworkspace` from the finder on your mac
2. From xcode set the active scheme to `Release`
3. Set the build target as `Generic iOS device`
4. Bump the version and build number in the project
5. Build the Archive in the menu under `Product -> Archive`

### Android

1. Open Android Studio
2. Open the project in the `android` directory
3. Bump the `versionName` and `versionCode` under `app/build.gradle`
4. From the menu `Build -> Clean Project`
5. From the menu `Build -> Generate Signed Bundle / APK`
