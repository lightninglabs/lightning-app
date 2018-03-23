import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    flex: 1,
  },
};

const Container = ({ children, style }) => (
  <View style={[styles.container, style]}>{children}</View>
);

Container.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default Container;
