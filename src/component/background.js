import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import BackgroundImage from './background-image';

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
    <BackgroundImage image={image} style={[styles.background, style]}>
      {children}
    </BackgroundImage>
  ) : (
    <View style={[{ backgroundColor: color }, styles.background, style]}>
      {children}
    </View>
  );

Background.propTypes = {
  image: PropTypes.string,
  color: PropTypes.string,
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
