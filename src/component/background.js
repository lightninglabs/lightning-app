import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import BackgroundImage from './background-image';

//
// Background
//

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
});

export const Background = ({ image, color, children, style }) =>
  image ? (
    <BackgroundImage image={image} style={styles.background}>
      <SafeAreaView style={[styles.safe, style]}>{children}</SafeAreaView>
    </BackgroundImage>
  ) : (
    <View style={[{ backgroundColor: color }, styles.background, style]}>
      <SafeAreaView style={[styles.safe, style]}>{children}</SafeAreaView>
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
  <BackgroundImage image={image} style={styles.background}>
    <View style={splitStyles.top} />
    <View style={[splitStyles.bottom, { backgroundColor: bottom }]} />
    <View style={StyleSheet.absoluteFill}>
      <SafeAreaView style={[styles.safe, style]}>{children}</SafeAreaView>
    </View>
  </BackgroundImage>
);

SplitBackground.propTypes = {
  image: PropTypes.string,
  color: PropTypes.string,
  bottom: PropTypes.string,
  children: PropTypes.node,
  style: View.propTypes.style,
};

export default Background;
