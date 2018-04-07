import React from 'react';
import { ScrollView, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
});

const MainContent = ({ children, style }) => (
  <ScrollView contentContainerStyle={[styles.content, style]}>
    {children}
  </ScrollView>
);

MainContent.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

export default MainContent;
