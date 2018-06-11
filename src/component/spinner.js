import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { color } from './style';

//
// Small Spinner
//

const smallStyles = StyleSheet.create({
  spinner: {
    transform: [{ scale: 1.42 }],
  },
});
export const SmallSpinner = ({ ...props }) => (
  <ActivityIndicator
    size="small"
    color={color.purple}
    style={smallStyles.spinner}
    {...props}
  />
);
