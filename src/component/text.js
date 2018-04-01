import React from 'react';
import { Text as RNText, TextPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { colors, font } from './style';

import '../../assets/font/OpenSans-Light.ttf';
import '../../assets/font/OpenSans-Regular.ttf';
import '../../assets/font/OpenSans-SemiBold.ttf';
import '../../assets/font/OpenSans-Bold.ttf';
import '../../assets/font/OpenSans-ExtraBold.ttf';

import '../../assets/font/Poppins-Thin.ttf';
import '../../assets/font/Poppins-ExtraLight.ttf';
import '../../assets/font/Poppins-Light.ttf';
import '../../assets/font/Poppins-Regular.ttf';
import '../../assets/font/Poppins-Medium.ttf';
import '../../assets/font/Poppins-SemiBold.ttf';
import '../../assets/font/Poppins-Bold.ttf';
import '../../assets/font/Poppins-ExtraBold.ttf';
import '../../assets/font/Poppins-Black.ttf';

import '../../assets/font/WorkSans-Thin.ttf';
import '../../assets/font/WorkSans-ExtraLight.ttf';
import '../../assets/font/WorkSans-Light.ttf';
import '../../assets/font/WorkSans-Regular.ttf';
import '../../assets/font/WorkSans-Medium.ttf';
import '../../assets/font/WorkSans-SemiBold.ttf';
import '../../assets/font/WorkSans-Bold.ttf';
import '../../assets/font/WorkSans-ExtraBold.ttf';
import '../../assets/font/WorkSans-Black.ttf';

import './font.css';

const styles = StyleSheet.create({
  base: {
    fontFamily: 'OpenSans Regular',
    fontSize: font.sizeBase,
    lineHeight: font.lineHeightBase,
    color: colors.white,
    zIndex: 1,
  },
});

const Text = ({ children, style, ...props }) => (
  <RNText style={[styles.base, style]} {...props}>
    {children}
  </RNText>
);

Text.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  style: TextPropTypes.style,
};

export const WrappedText = ({ children, numLines, style }) => (
  <RNText
    numberOfLines={numLines}
    style={[styles.base, style]}
  >
    {children}
  </RNText>
);

WrappedText.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  numLines: PropTypes.number,
  style: TextPropTypes.style,
};

export default Text;
