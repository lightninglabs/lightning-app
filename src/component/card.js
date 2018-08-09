import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { color } from './style';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: color.whiteBg,
    width: 500,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 25,
    paddingBottom: 70,
  },
});

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

Card.propTypes = {
  children: PropTypes.node,
  style: View.propTypes.style,
};

export default Card;
