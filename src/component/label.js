import React from 'react';
import { View, TextPropTypes, StyleSheet } from 'react-native';
import Text from './text';
import PropTypes from 'prop-types';
import { font } from './style';

const stylesBalance = StyleSheet.create({
  label: {
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
    fontSize: font.sizeL,
    lineHeight: 60,
    marginLeft: 10,
  },
});

export const BalanceLabel = ({ children, unit, style }) => (
  <View style={stylesBalance.label}>
    <Text style={[stylesBalance.numeral, style]}>{children}</Text>
    <Text style={[stylesBalance.unit, style]}>{unit}</Text>
  </View>
);

BalanceLabel.propTypes = {
  children: PropTypes.string.isRequired,
  unit: PropTypes.string,
  style: TextPropTypes.style,
};
