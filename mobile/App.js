import 'node-libs-react-native/globals';
import { Platform } from 'react-native';
if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en-US');
}

import App from '../src/view/main-mobile';

module.exports = App;
