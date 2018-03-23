import React from 'react';
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    height: '100vh',
    width: '100vw',
    flex: 1,
  },
});

const Container = ({ children, style }) => (
  <View style={[styles.container, style]}>{children}</View>
);

Container.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
};

export default Container;
