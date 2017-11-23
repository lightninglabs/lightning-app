import React from 'react';
import { Text as TextNative } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from '../styles';

export const Text = ({ style, children }) => (
  <TextNative style={{ ...style }}>{children}</TextNative>
);
Text.propTypes = {
  style: PropTypes.object,
  children: PropTypes.any,
};

export const TextB = ({ style, children }) => (
  <TextNative style={{ fontWeight: 'bold', ...style }}>{children}</TextNative>
);
TextB.propTypes = {
  style: PropTypes.object,
  children: PropTypes.any,
};

export default Text;
