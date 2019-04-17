import React from 'react';
import { Text as RNText, StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from './media-query';
import Text from './text';
import { TextInput, HorizontalExpandingTextInput } from './input';
import { color, font, breakWidth } from './style';

//
// Amount Input Field
//

const amountStyles = StyleSheet.create({
  input: {
    textAlign: 'right',
    fontFamily: 'WorkSans ExtraLight',
    fontSize: font.sizeXXXL,
    lineHeight: font.lineHeightXXXL - 6,
    height: font.lineHeightXXXL,
    marginLeft: -23,
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
  style: RNText.propTypes.style,
};

//
// Input Field
//

const inputStyles = StyleSheet.create({
  input: {
    alignSelf: 'stretch',
    textAlign: 'center',
    borderBottomWidth: 1,
  },
});

export const InputField = ({ style, ...props }) => (
  <TextInput style={[inputStyles.input, style]} {...props} />
);

InputField.propTypes = {
  children: PropTypes.string,
  style: RNText.propTypes.style,
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
    borderBottomWidth: 1,
  },
  name: {
    color: color.blackText,
    fontSize: font.sizeM,
    lineHeight: font.lineHeightM + 2 * 12,
    marginRight: 15,
  },
  text: {
    flex: 1,
    textAlign: 'right',
    fontSize: font.sizeM,
    lineHeight: font.lineHeightM + 2 * 12,
    color: color.blackText,
    opacity: 0.5,
  },
});

export const NamedField = ({ name, children, style }) => (
  <View style={[namedStyles.content, style]}>
    <Text style={namedStyles.name}>{name}</Text>
    <Text style={namedStyles.text} numberOfLines={1}>
      {children}
    </Text>
  </View>
);

NamedField.propTypes = {
  name: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  style: ViewPropTypes.style,
};

//
// Detail Field
//

const baseDetailStyles = {
  content: {
    alignSelf: 'stretch',
    paddingTop: 12,
    borderBottomColor: color.greyLight,
    borderBottomWidth: 1,
  },
  name: {
    fontFamily: 'OpenSans Bold',
    fontSize: font.sizeXS,
    lineHeight: font.lineHeightXS,
    color: color.blackDark,
  },
  text: {
    fontSize: font.sizeXS,
    lineHeight: font.lineHeightXS + 2 * 3,
    color: color.blackDark,
  },
};

const detailStyles = createStyles(
  baseDetailStyles,

  maxWidth(breakWidth, {
    content: {
      paddingTop: 17,
      paddingBottom: 15,
    },
    name: {
      fontSize: font.sizeSub,
    },
    text: {
      marginTop: 4,
      fontSize: font.sizeSub,
    },
  })
);

export const DetailField = ({ name, children, style }) => (
  <View style={[detailStyles.content, style]}>
    <Text style={detailStyles.name}>{name}</Text>
    <Text style={detailStyles.text} selectable>
      {children}
    </Text>
  </View>
);

DetailField.propTypes = {
  name: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  style: ViewPropTypes.style,
};
