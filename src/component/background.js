import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';

//
// Background
//

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
  },
});

export const Background = ({ image, color, node, children, style }) =>
  node ? (
    <View style={[styles.background, style]}>
      {node}
      <View style={StyleSheet.absoluteFill}>{children}</View>
    </View>
  ) : image ? (
    <ImageBackground
      source={image}
      style={[styles.background, styles.image, style]}
    >
      {children}
    </ImageBackground>
  ) : (
    <View style={[{ backgroundColor: color }, styles.background, style]}>
      {children}
    </View>
  );

Background.propTypes = {
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  node: PropTypes.node,
  children: PropTypes.node,
  style: View.propTypes.style,
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
});

export const SplitBackground = ({ image, color, bottom, children, style }) => (
  <Background image={image} color={color} style={style}>
    <View style={splitStyles.top} />
    <View style={[splitStyles.bottom, { backgroundColor: bottom }]} />
    <View style={StyleSheet.absoluteFill}>{children}</View>
  </Background>
);

SplitBackground.propTypes = {
  image: PropTypes.string,
  color: PropTypes.string,
  bottom: PropTypes.string,
  children: PropTypes.node,
  style: View.propTypes.style,
};

export default Background;
