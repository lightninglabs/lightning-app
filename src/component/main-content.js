import React from 'react';
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const MainContent = ({ children, style }) => (
  <View style={[styles.content, style]}>{children}</View>
);

MainContent.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

export default MainContent;
