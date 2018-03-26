import React from 'react';
import { View, TextPropTypes, StyleSheet } from 'react-native';
import Text from './text';
import PropTypes from 'prop-types';

const stylesBalance = StyleSheet.create({
  label: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  numeral: {
    fontFamily: 'WorkSans ExtraLight',
    fontSize: 80,
    lineHeight: 100,
  },
  unit: {
    fontFamily: 'WorkSans Regular',
    fontSize: 20,
    lineHeight: 60,
    marginLeft: 10,
  },
});

export const LabelBalance = ({ children, fiat, unit, style }) => (
  <View style={stylesBalance.label}>
    <Text style={[stylesBalance.numeral, style]}>
      {fiat}
      {children}
    </Text>
    <Text style={[stylesBalance.unit, style]}>{unit}</Text>
  </View>
);

LabelBalance.propTypes = {
  children: PropTypes.string.isRequired,
  fiat: PropTypes.string,
  unit: PropTypes.string,
  style: TextPropTypes.style,
};
