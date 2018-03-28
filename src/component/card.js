import React from 'react';
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from './style';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.whiteBg,
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
  style: ViewPropTypes.style,
};

export default Card;
