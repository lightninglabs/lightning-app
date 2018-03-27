import React from 'react';
import { Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const Icon = ({ image, style }) => (
  <Image source={require(`../../assets/img/${image}.svg`)} style={style} />
);

Icon.propTypes = {
  image: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

export default Icon;
