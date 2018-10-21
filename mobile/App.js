import 'node-libs-react-native/globals';
import Storybook from './storybook';

import App from './main';

module.exports = !__DEV__ ? Storybook : App;
