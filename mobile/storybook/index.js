import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import {
  getStorybookUI,
  configure,
  addDecorator,
} from '@storybook/react-native';
import FontLoader from '../component/font-loader';

addDecorator(story => <FontLoader>{story()}</FontLoader>);

// import stories
configure(() => {
  require('../../stories/component/button-story');
  require('../../stories/component/card-story');
  require('../../stories/component/field-story');
  require('../../stories/component/header-story');
  require('../../stories/component/icon-story');
  require('../../stories/component/label-story');
  require('../../stories/component/list-story');
  require('../../stories/component/notification-story');
  // require('../../stories/component/qrcode-story');
  require('../../stories/component/spinner-story');
  require('../../stories/component/text-story');
  require('../../stories/color-story');
  require('../../stories/font-story');
  require('../../stories/layout-story');
  // require('../../stories/screen-story');
}, module);

// This assumes that storybook is running on the same host as your RN packager,
// to set manually use, e.g. host: 'localhost' option
const StorybookUIRoot = getStorybookUI({ port: 7007, onDeviceUI: true });

// react-native hot module loader must take in a Class - https://github.com/facebook/react-native/issues/10991
// https://github.com/storybooks/storybook/issues/2081
// eslint-disable-next-line react/prefer-stateless-function
class StorybookUIHMRRoot extends Component {
  render() {
    return <StorybookUIRoot />;
  }
}

AppRegistry.registerComponent('%APP_NAME%', () => StorybookUIHMRRoot);
export default StorybookUIHMRRoot;
