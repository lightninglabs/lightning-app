import React from 'react';
import { View, Text as RNText, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { color, font } from './style';

//
// Form Stretcher
//

const stretcherStyles = StyleSheet.create({
  content: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },
});

export const FormStretcher = ({ children, style }) => (
  <View style={[stretcherStyles.content, style]}>{children}</View>
);

FormStretcher.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

//
// Form Text
//

const textStyles = StyleSheet.create({
  text: {
    color: color.blackText,
    textAlign: 'center',
    paddingTop: 10,
  },
});

export const FormText = ({ children, style }) => (
  <Text style={[textStyles.text, style]}>{children}</Text>
);

FormText.propTypes = {
  children: PropTypes.string,
  style: RNText.propTypes.style,
};

//
// Form Sub Text
//

const subTextStyles = StyleSheet.create({
  text: {
    fontSize: font.sizeSub,
    lineHeight: font.lineHeightSub,
    color: color.greyText,
    textAlign: 'center',
  },
});

export const FormSubText = ({ children, style }) => (
  <Text style={[subTextStyles.text, style]}>{children}</Text>
);

FormSubText.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  style: RNText.propTypes.style,
};
