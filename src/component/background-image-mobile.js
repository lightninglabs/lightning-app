/**
 * @fileOverview common background images for both iOS and Android.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { SvgBackground } from './image';
import PurpleGradientBg from '../asset/img/purple-gradient-bg';
import OrangeGradientBg from '../asset/img/orange-gradient-bg';
import TexturedBg from '../asset/img/textured-bg';

const BackgroundImage = ({ image, ...props }) =>
  image === 'purple-gradient-bg' ? (
    <SvgBackground
      svg={<PurpleGradientBg style={StyleSheet.absoluteFill} />}
      {...props}
    />
  ) : image === 'orange-gradient-bg' ? (
    <SvgBackground
      svg={<OrangeGradientBg style={StyleSheet.absoluteFill} />}
      {...props}
    />
  ) : image === 'textured-bg' ? (
    <SvgBackground
      svg={<TexturedBg style={StyleSheet.absoluteFill} />}
      {...props}
    />
  ) : null;

BackgroundImage.propTypes = {
  image: PropTypes.string,
};

export default BackgroundImage;
