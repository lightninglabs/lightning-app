import React from 'react';
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from './media-query';
import Text from './text';
import { color, font, breakWidth } from './style';

//
// Header
//

const baseStyles = {
  header: {
    minHeight: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shadow: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowColor: color.black,
    shadowOpacity: 0.3,
    zIndex: 1,
  },
  separator: {
    shadowOffset: { width: 0, height: 0.25 },
    shadowColor: color.white,
  },
  centerTitle: {
    justifyContent: 'center',
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(breakWidth, {
    separator: {
      shadowOffset: { width: 0, height: 0 },
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: color.white,
    },
  })
);

export const Header = ({ style, children, color, shadow, separator }) => (
  <View
    style={[
      styles.header,
      !children.length ? styles.centerTitle : null,
      color ? { backgroundColor: color } : null,
      shadow ? styles.shadow : null,
      separator ? styles.separator : null,
      style,
    ]}
  >
    {children}
  </View>
);

Header.propTypes = {
  style: ViewPropTypes.style,
  children: PropTypes.node,
  color: PropTypes.string,
  shadow: PropTypes.bool,
  separator: PropTypes.bool,
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
    fontSize: 15,
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
  style: Text.propTypes.style,
  children: PropTypes.node,
};

//
// Large Title
//

const largeTitleStyles = StyleSheet.create({
  titleWrapper: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  title: {
    maxWidth: 200,
    textAlign: 'center',
    fontSize: font.sizeSub,
    lineHeight: font.lineHeightSub,
    letterSpacing: 1,
  },
  titleIcon: {
    marginTop: 10,
  },
});

export const LargeTitle = ({ title = '', style, children }) => (
  <View style={largeTitleStyles.titleWrapper}>
    {children}
    <Text
      style={[
        largeTitleStyles.title,
        children ? largeTitleStyles.titleIcon : null,
        style,
      ]}
    >
      {title}
    </Text>
  </View>
);

LargeTitle.propTypes = {
  title: PropTypes.string,
  style: Text.propTypes.style,
  children: PropTypes.node,
};

export default Header;
