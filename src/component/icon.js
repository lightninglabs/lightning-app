import React from 'react';
import { Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const Icon = ({ image, style }) => <Image source={image} style={style} />;

Icon.propTypes = {
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  style: ViewPropTypes.style,
};

export default Icon;
