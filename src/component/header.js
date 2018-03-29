import React from 'react';
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { colors } from './style';

//
// Header
//

const styles = StyleSheet.create({
  header: {
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.purple,
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  centerTitle: {
    justifyContent: 'center',
  },
});

export const Header = ({ style, children }) => (
  <View
    style={[styles.header, !children.length ? styles.centerTitle : null, style]}
  >
    {children}
  </View>
);

Header.propTypes = {
  style: ViewPropTypes.style,
  children: PropTypes.node,
};

//
// Title
//

const titleStyles = StyleSheet.create({
  titleWrapper: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'OpenSans Regular',
    fontSize: 16,
    letterSpacing: 2,
  },
  titleIcon: {
    marginTop: 4,
    fontSize: 14,
  },
});

export const Title = ({ title = '', style, children }) => (
  <View style={titleStyles.titleWrapper}>
    {children}
    <Text
      style={[
        titleStyles.title,
        children ? titleStyles.titleIcon : null,
        style,
      ]}
    >
      {title.toUpperCase()}
    </Text>
  </View>
);

Title.propTypes = {
  title: PropTypes.string,
  style: ViewPropTypes.style,
  children: PropTypes.node,
};

export default Header;
