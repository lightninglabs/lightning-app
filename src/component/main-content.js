import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

const styles = {
  content: {
    flex: 1,
  },
};

const MainContent = ({ children }) => (
  <View style={styles.content}>{children}</View>
);

MainContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainContent;
