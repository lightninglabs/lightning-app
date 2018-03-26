import React from 'react';
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import Text from './text';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  header: {
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.15)',
  },
});

const Header = ({ title, style }) => (
  <View style={[styles.header, style]}>
    <View />
    <Text>{title}</Text>
    <View />
  </View>
);

Header.propTypes = {
  title: PropTypes.string,
  style: ViewPropTypes.style,
};

export default Header;
