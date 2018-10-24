import React from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';

const Icon = ({ image, style }) => <Image source={image} style={style} />;

Icon.propTypes = {
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  style: View.propTypes.style,
};

export default Icon;
