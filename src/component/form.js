import React from 'react';
import { View, TextPropTypes, StyleSheet } from 'react-native';
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

export const FormStretcher = ({ children }) => (
  <View style={stretcherStyles.content}>{children}</View>
);

FormStretcher.propTypes = {
  children: PropTypes.node,
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
  style: TextPropTypes.style,
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
    paddingTop: 40,
    paddingBottom: 40,
  },
});

export const FormSubText = ({ children, style }) => (
  <Text style={[subTextStyles.text, style]}>{children}</Text>
);

FormSubText.propTypes = {
  children: PropTypes.string,
  style: TextPropTypes.style,
};
