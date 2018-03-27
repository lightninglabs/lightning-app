import React from 'react';
import { View, StyleSheet, ImageBackground, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});

const Background = ({ image, color, gradient, children, style }) =>
  image ? (
    <ImageBackground
      source={require(`../../assets/img/${image}.svg`)}
      style={[styles.background, style]}
    >
      {children}
    </ImageBackground>
  ) : (
    <View
      style={[
        gradient ? { backgroundImage: gradient } : { backgroundColor: color },
        styles.background,
        style,
      ]}
    >
      {children}
    </View>
  );

Background.propTypes = {
  image: PropTypes.string,
  color: PropTypes.string,
  gradient: PropTypes.string,
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

export default Background;
