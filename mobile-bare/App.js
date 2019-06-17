import 'node-libs-react-native/globals';
import { Platform, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

// Configure expo-font to load .ttf files
// See: https://github.com/expo/expo/tree/master/packages/expo-font
StyleSheet.setStyleAttributePreprocessor('fontFamily', Font.processFontFamily);

// Polyfill ECMAScript Internationalization API on Android
// See: https://github.com/facebook/react-native/issues/19410
if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en-US');
}

import App from '../src/view/main-mobile';

module.exports = App;
