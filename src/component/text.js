import React from 'react';
import { Text as RNText, TextPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from './styles';

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

const styles = {
  base: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    lineHeight: 20,
    color: colors.white,
  },
};

const Text = ({ children, style }) => (
  <RNText style={[styles.base, style]}>{children}</RNText>
);

Text.propTypes = {
  children: PropTypes.string.isRequired,
  style: TextPropTypes.style,
};

export default Text;
