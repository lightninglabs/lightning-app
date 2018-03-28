import React from 'react';
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { colors } from './style';

const styles = StyleSheet.create({
  header: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.purple,
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  title: {
    fontFamily: 'OpenSans Regular',
    letterSpacing: 2,
  },
});

const Header = ({ title = '', style }) => (
  <View style={[styles.header, style]}>
    <View />
    <Text style={styles.title}>{title.toUpperCase()}</Text>
    <View />
  </View>
);

Header.propTypes = {
  title: PropTypes.string,
  style: ViewPropTypes.style,
};

export default Header;
