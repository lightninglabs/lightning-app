import React from 'react';
import { View, ViewPropTypes, TextPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { font } from './style';

//
// Balance Label
//

const balanceStyles = StyleSheet.create({
  label: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  numeral: {
    fontFamily: 'WorkSans ExtraLight',
    fontSize: font.sizeXXXL,
    lineHeight: font.lineHeightXXXL,
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
  <Text style={[balanceStyles.numeral, style]}>{children}</Text>
);

BalanceLabelNumeral.propTypes = {
  children: PropTypes.string.isRequired,
  style: TextPropTypes.style,
};

export const BalanceLabelUnit = ({ children, style }) =>
  children ? <Text style={[balanceStyles.unit, style]}>{children}</Text> : null;

BalanceLabelUnit.propTypes = {
  children: PropTypes.string,
  style: TextPropTypes.style,
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
    style: TextPropTypes.style,
};

//
// Amount Label
//

const stylesAmount = StyleSheet.create({
  label: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  numeral: {
    fontFamily: 'WorkSans ExtraLight',
    fontSize: 103,
    lineHeight: 100,
  },
  unit: {
    fontFamily: 'WorkSans Regular',
    fontSize: 23,
    lineHeight: 48,
    marginLeft: 10,
  },
});

export const LabelAmount = ({ children, unit, style }) => (
  <View style={stylesAmount.label}>
    <Text style={[stylesAmount.numeral, style]}>{children}</Text>
    <Text style={[stylesAmount.unit, style]}>{unit}</Text>
  </View>
);

LabelAmount.propTypes = {
  children: PropTypes.string.isRequired,
  unit: PropTypes.string,
  style: TextPropTypes.style,
  numeralStyle: TextPropTypes.style,
  unitStyle: TextPropTypes.style,
};

//
// Small Label
//

const smallStyles = StyleSheet.create({
  label: {
    fontFamily: 'OpenSans SemiBold',
    fontSize: font.sizeS,
    lineHeight: font.lineHeightS,
  },
});

export const SmallLabel = ({ children, style }) => (
  <Text style={[smallStyles.label, style]}>{children}</Text>
);

SmallLabel.propTypes = {
  children: PropTypes.string.isRequired,
  style: TextPropTypes.style,
};
