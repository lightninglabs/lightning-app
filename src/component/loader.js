import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { color } from './style';

const circleStyles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: color.white,
  },
});

export const Circle = ({ children, style }) => (
  <View style={[circleStyles.circle, style]}>{children}</View>
);

Circle.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
};
