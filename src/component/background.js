import React from 'react';
import { View, StyleSheet, ImageBackground, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

//
// Background
//

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});

export const Background = ({ image, color, children, style }) =>
  image ? (
    <ImageBackground
      source={require(`../asset/img/${image}.svg`)}
      style={[styles.background, style]}
    >
      {children}
    </ImageBackground>
  ) : (
    <View style={[{ backgroundColor: color }, styles.background, style]}>
      {children}
    </View>
  );

Background.propTypes = {
  image: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

//
// Split Background
//

const splitStyles = StyleSheet.create({
  top: {
    flex: 1,
  },
  bottom: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export const SplitBackground = ({ image, color, bottom, children, style }) => (
  <Background image={image} color={color} style={style}>
    <View style={splitStyles.top} />
    <View style={[splitStyles.bottom, { backgroundColor: bottom }]} />
    <View style={splitStyles.content}>{children}</View>
  </Background>
);

SplitBackground.propTypes = {
  image: PropTypes.string,
  color: PropTypes.string,
  bottom: PropTypes.string,
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

export default Background;
