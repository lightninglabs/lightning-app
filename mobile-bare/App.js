import 'node-libs-react-native/globals';
import { Platform } from 'react-native';

// Polyfill ECMAScript Internationalization API on Android
// See: https://github.com/facebook/react-native/issues/19410
if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en-US');
}

import App from '../src/view/main-mobile';

module.exports = App;
