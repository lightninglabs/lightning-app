import React from 'react';
import { View } from 'react-native';
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
  style: PropTypes.object,
};

export default MainContent;
