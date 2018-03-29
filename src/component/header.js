import React from 'react';
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { IconButton } from './button';
import { colors } from './style';

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
  backIcon: {
    height: 14,
    width: 8.4,
  },
  cancelIcon: {
    height: 14,
    width: 14,
  },
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

const Header = ({ title = '', style, onBack, onCancel, children }) => (
  <View style={[styles.header, style]}>
    {onBack ? (
      <IconButton image="back" onPress={onBack} style={styles.backIcon} />
    ) : (
      <View />
    )}
    <View style={styles.titleWrapper}>
      {children}
      <Text style={[styles.title, children ? styles.titleIcon : null]}>
        {title.toUpperCase()}
      </Text>
    </View>
    {onCancel ? (
      <IconButton image="cancel" onPress={onCancel} style={styles.cancelIcon} />
    ) : (
      <View />
    )}
  </View>
);

Header.propTypes = {
  title: PropTypes.string,
  style: ViewPropTypes.style,
  onBack: PropTypes.func,
  onCancel: PropTypes.func,
  children: PropTypes.node,
};

export default Header;
