/**
 * @fileOverview background images for desktop as react-native-web supports
 * .svg file types for the Image component while iOS and Android do not.
 * Rendering .svg files in Image results in better rendering results than
 * inlining since the browser engine can scale an svg image tag directly.
 */

import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { ImageBackground } from './image';

const BackgroundImage = ({ image, ...props }) =>
  image ? (
    <ImageBackground source={require(`../asset/img/${image}.svg`)} {...props} />
  ) : (
    <View {...props} />
  );

BackgroundImage.propTypes = {
  image: PropTypes.string,
};

export default BackgroundImage;
