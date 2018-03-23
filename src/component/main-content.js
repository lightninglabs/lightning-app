import React from 'react';
import { View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const styles = {
  content: {
    flex: 1,
  },
};

const MainContent = ({ children, style }) => (
  <View style={[styles.content, style]}>{children}</View>
);

MainContent.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
};

export default MainContent;
