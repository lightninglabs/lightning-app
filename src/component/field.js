import React from 'react';
import { ViewPropTypes, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { colors } from './style';

const namedStyles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    borderBottomColor: colors.darkText,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
  },
  name: {
    color: colors.darkText,
    fontSize: 18,
  },
  text: {
    fontFamily: 'OpenSans Light',
    width: '85%',
    color: colors.darkText,
    marginBottom: 7,
    fontSize: 18,
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
