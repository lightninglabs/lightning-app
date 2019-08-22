import React from 'react';
import { View, Text as RNText, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { font } from './style';

//
// Balance Label
//

const balanceStyles = StyleSheet.create({
  label: {
    flexDirection: 'row',
  },
  numeral: {
    fontFamily: 'WorkSans ExtraLight',
    fontSize: font.sizeXXXL,
    lineHeight: null,
  },
  unit: {
    fontFamily: 'WorkSans Regular',
    fontSize: font.sizeL,
    lineHeight: 60,
    marginLeft: 10,
  },
});

export const BalanceLabel = ({ children, style }) => (
  <View style={[balanceStyles.label, style]}>{children}</View>
);

BalanceLabel.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
};

export const BalanceLabelNumeral = ({ children, style }) => (
  <Text
    style={[balanceStyles.numeral, style]}
    adjustsFontSizeToFit={true}
    numberOfLines={1}
  >
    {children}
  </Text>
);

BalanceLabelNumeral.propTypes = {
  children: PropTypes.string.isRequired,
  style: RNText.propTypes.style,
};

export const BalanceLabelUnit = ({ children, style }) =>
  children ? <Text style={[balanceStyles.unit, style]}>{children}</Text> : null;

BalanceLabelUnit.propTypes = {
  children: PropTypes.string,
  style: RNText.propTypes.style,
};

//
// Small Balance Label
//

const smallBalanceStyles = StyleSheet.create({
  label: {
    flexDirection: 'row',
  },
  numeral: {
    fontFamily: 'OpenSans Light',
    fontSize: font.sizeL,
    lineHeight: font.lineHeightL,
  },
  unit: {
    fontFamily: 'OpenSans Light',
    fontSize: font.sizeL,
    lineHeight: font.lineHeightL,
    marginLeft: 7,
  },
});

export const SmallBalanceLabel = ({ children, unit, style }) => (
  <View style={smallBalanceStyles.label}>
    <Text style={[smallBalanceStyles.numeral, style]}>{children}</Text>
    {unit ? <Text style={[smallBalanceStyles.unit, style]}>{unit}</Text> : null}
  </View>
);

SmallBalanceLabel.propTypes = {
  children: PropTypes.string.isRequired,
  unit: PropTypes.string,
  style: RNText.propTypes.style,
};
