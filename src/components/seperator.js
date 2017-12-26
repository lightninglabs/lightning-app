import React from 'react';
import { View } from 'react-native';
import { colors } from '../styles';

const styles = {
  seperator: {
    height: 1,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: colors.lightestgray
  }
}

const Seperator = () => (
  <View style={styles.seperator} />
)

export default Seperator;
