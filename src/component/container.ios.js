import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

const Container = ({ children, style }) => (
  <View style={[styles.container, style]}>{children}</View>
);

Container.propTypes = {
  children: PropTypes.node,
  style: View.propTypes.style,
};

export default Container;
