import React from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';

const Icon = ({ image, style }) => (
  <Image source={require(`../asset/icon/${image}.svg`)} style={style} />
);

Icon.propTypes = {
  image: PropTypes.string.isRequired,
  style: View.propTypes.style,
};

export default Icon;
