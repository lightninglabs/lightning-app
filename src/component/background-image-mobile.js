/**
 * @fileOverview common background images for both iOS and Android.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { SvgBackground } from './image';
import PurpleGradientBg from '../asset/img/purple-gradient-bg';
import OrangeGradientBg from '../asset/img/orange-gradient-bg';
import TexturedBg from '../asset/img/textured-bg-mobile';

const BackgroundImage = ({ image, ...props }) => (
  <SvgBackground
    svg={
      image === 'purple-gradient-bg' ? (
        <PurpleGradientBg style={StyleSheet.absoluteFill} />
      ) : image === 'orange-gradient-bg' ? (
        <OrangeGradientBg style={StyleSheet.absoluteFill} />
      ) : image === 'textured-bg' ? (
        <TexturedBg style={StyleSheet.absoluteFill} />
      ) : null
    }
    {...props}
  />
);

BackgroundImage.propTypes = {
  image: PropTypes.string,
};

export default BackgroundImage;
