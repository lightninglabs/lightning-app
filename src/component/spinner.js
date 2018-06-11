import React from 'react';
import { ActivityIndicator } from 'react-native';
import { color } from './style';

//
// Small Spinner
//

export const SmallSpinner = () => (
  <ActivityIndicator size="large" color={color.purple} />
);
