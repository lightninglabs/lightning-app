import 'node-libs-react-native/globals';

// Polyfill ECMAScript Internationalization API on Android
// See: https://github.com/facebook/react-native/issues/19410
import 'intl';
import 'intl/locale-data/jsonp/en-US';

import { StyleSheet } from 'react-native';
import * as Font from 'expo-font';
StyleSheet.setStyleAttributePreprocessor('fontFamily', Font.processFontFamily);

import App from '../src/view/main-mobile';

module.exports = App;
