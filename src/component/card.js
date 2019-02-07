import React from 'react';
import { View, ViewPropTypes } from 'react-native';
import { createStyles, maxWidth } from '../component/media-query';
import PropTypes from 'prop-types';
import { color, breakWidth } from './style';

//
// Card
//

const baseStyles = {
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
};

const styles = createStyles(
  baseStyles,

  maxWidth(breakWidth, {
    card: {
      alignSelf: 'stretch',
      width: undefined,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
      paddingBottom: 10,
    },
  })
);

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

Card.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

export default Card;
