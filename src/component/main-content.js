import React from 'react';
import { View, ScrollView, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
});

const MainContent = ({ children, style }) => (
  <ScrollView contentContainerStyle={styles.scroll}>
    <View style={[styles.content, style]}>{children}</View>
  </ScrollView>
);

MainContent.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

export default MainContent;
