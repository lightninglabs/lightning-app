import React from 'react';
import { Text as RNText } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from './styles';

import '../../assets/font/OpenSans-Regular.ttf';
import '../../assets/font/OpenSans-Bold.ttf';
import '../../assets/font/OpenSans-Light.ttf';
import '../../assets/font/Poppins-Regular.ttf';
import '../../assets/font/Poppins-Bold.ttf';
import '../../assets/font/Poppins-Light.ttf';
import '../../assets/font/WorkSans-Regular.ttf';
import '../../assets/font/WorkSans-Bold.ttf';
import '../../assets/font/WorkSans-Light.ttf';
import './font.css';

const BASE_FONT_SIZE = 15;
const BASE_FONT_HEIGHT = 20;

const styles = {
  base: {
    fontFamily: 'OpenSans',
    fontSize: BASE_FONT_SIZE,
    lineHeight: BASE_FONT_HEIGHT,
    color: colors.white,
  },
  baseBold: {
    fontFamily: 'OpenSans Bold',
  },
};

export const Text = ({ children, style }) => (
  <RNText style={[styles.base, style]}>{children}</RNText>
);

export const TextB = ({ children, style }) => (
  <RNText style={[styles.base, styles.baseBold, style]}>{children}</RNText>
);

const propTypes = {
  children: PropTypes.string.isRequired,
  style: PropTypes.object,
};

Text.propTypes = propTypes;
TextB.propTypes = propTypes;

export default Text;
