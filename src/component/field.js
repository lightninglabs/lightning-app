import React from 'react';
import { TextPropTypes, ViewPropTypes, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { TextInput, HorizontalExpandingTextInput } from './input';
import { color, font } from './style';

//
// Amount Input Field
//

const amountStyles = StyleSheet.create({
  input: {
    textAlign: 'right',
    fontFamily: 'WorkSans ExtraLight',
    fontSize: font.sizeXXXL,
  },
});

export const AmountInputField = ({ style, ...props }) => (
  <HorizontalExpandingTextInput
    style={[amountStyles.input, style]}
    charWidth={46}
    keyboardType="numeric"
    placeholder="0"
    placeholderTextColor={color.blackText}
    {...props}
  />
);

AmountInputField.propTypes = {
  style: TextPropTypes.style,
};

//
// Input Field
//

const inputStyles = StyleSheet.create({
  input: {
    alignSelf: 'stretch',
    textAlign: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export const InputField = ({ style, ...props }) => (
  <TextInput style={[inputStyles.input, style]} {...props} />
);

InputField.propTypes = {
  children: PropTypes.string,
  style: TextPropTypes.style,
};

//
// Named Field
//

const namedStyles = StyleSheet.create({
  content: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: color.blackText,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  name: {
    color: color.blackText,
    fontSize: font.sizeM,
    lineHeight: font.lineHeightM + 2 * 8,
    marginRight: 10,
  },
  text: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'OpenSans Light',
    fontSize: font.sizeM,
    lineHeight: font.lineHeightM + 2 * 8,
    color: color.blackText,
  },
});

export const NamedField = ({ name, children, style }) => (
  <View style={[namedStyles.content, style]}>
    <Text style={namedStyles.name}>{name}</Text>
    <Text style={namedStyles.text}>{children}</Text>
  </View>
);

NamedField.propTypes = {
  name: PropTypes.string,
  children: PropTypes.string,
  style: ViewPropTypes.style,
};
