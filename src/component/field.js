import React from 'react';
import { ViewPropTypes, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { colors } from './style';

const namedStyles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexDirection: 'row',
    borderBottomColor: colors.blackText,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  name: {
    flex: 1,
    color: colors.blackText,
    fontSize: 18,
  },
  text: {
    flex: 5,
    fontFamily: 'OpenSans Light',
    fontSize: 18,
    color: colors.blackText,
    marginBottom: 7,
    textAlign: 'right',
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
