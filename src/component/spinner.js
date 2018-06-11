import React from 'react';
import { ActivityIndicator } from 'react-native';
import { color } from './style';

//
// Small Spinner
//

export const SmallSpinner = ({ ...props }) => (
  <ActivityIndicator size="large" color={color.purple} {...props} />
);
