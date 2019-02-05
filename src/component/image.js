import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground as RNImageBackground,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';

//
// Image Background
//

const backgroundStyles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
});

export const ImageBackground = ({ source, children, style }) => (
  <RNImageBackground source={source} style={[backgroundStyles.image, style]}>
    {children}
  </RNImageBackground>
);

ImageBackground.propTypes = {
  source: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

//
// Svg Background
//

const svgStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export const SvgBackground = ({ svg, children, style }) => (
  <View style={svgStyles.wrapper}>
    {svg}
    <View style={[StyleSheet.absoluteFill, style]}>{children}</View>
  </View>
);

SvgBackground.propTypes = {
  svg: PropTypes.node,
  children: PropTypes.node,
  style: ViewPropTypes.style,
};
