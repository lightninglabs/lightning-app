import React from 'react';
import { View } from 'react-native';
import { colors } from './styles';

const styles = {
  separator: {
    height: 1,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: colors.lightestgray,
  },
};

const Separator = () => <View style={styles.separator} />;

export default Separator;
