import React from 'react';
import { ViewPropTypes, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { colors, font } from './style';

const namedStyles = StyleSheet.create({
  content: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colors.blackText,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  name: {
    color: colors.blackText,
    fontSize: font.sizeM,
    marginRight: 10,
  },
  text: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'OpenSans Light',
    fontSize: font.sizeM,
    lineHeight: font.lineHeightM,
    color: colors.blackText,
    marginBottom: 8,
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
