import React from 'react';
import { View, TextPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { color } from './style';

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
// Form Sub Text
//

const subTextStyles = StyleSheet.create({
  text: {
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
