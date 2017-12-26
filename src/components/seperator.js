import React from 'react';
import { View } from 'react-native';
import { colors } from '../styles';

const Seperator = () => (
  <View
    style={{
      height: 1,
      marginTop: 20,
      marginBottom: 20,
      backgroundColor: colors.lightestgray,
    }}
  />
)

export default Seperator;
