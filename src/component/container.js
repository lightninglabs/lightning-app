import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from './styles';

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    flex: 1,
    backgroundColor: colors.purple,
  },
};

const Container = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Container;
