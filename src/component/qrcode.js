import React from 'react';
import { StyleSheet, View, Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import QRImage from 'qr-image';
import { color } from './style';

const styles = StyleSheet.create({
  base: {
    padding: 30,
    borderRadius: 13,
    backgroundColor: color.white,
  },
});

const QRCode = ({ children = '', size = 180, style }) => {
  const uri = `data:image/png;base64,${QRImage.imageSync(children, {
    type: 'png',
    size: 10,
    margin: 0,
  }).toString('base64')}`;
  return (
    <View style={[styles.base, style]}>
      <Image source={{ uri }} style={{ width: size, height: size }} />
    </View>
  );
};

QRCode.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.number,
  style: ViewPropTypes.style,
};

export default QRCode;
