import 'node-libs-react-native/globals';
import Storybook from './storybook';

import App from '../src/view/main-mobile';

module.exports = !__DEV__ ? Storybook : App;
