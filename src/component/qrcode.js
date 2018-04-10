import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import QRImage from 'qr-image';
import { colors } from './style';

const styles = StyleSheet.create({
  base: {
    padding: 30,
    borderRadius: 13,
    backgroundColor: colors.white,
  },
  image: {
    width: 180,
    height: 180,
  },
});

const QRCode = ({ children, style }) => {
  const uri = `data:image/svg+xml;utf8,${QRImage.imageSync(children, {
    type: 'svg',
  })}`;
  return (
    <View style={[styles.base, style]}>
      <Image source={{ uri }} style={styles.image} />
    </View>
  );
};

QRCode.propTypes = {
  children: PropTypes.string.isRequired,
  style: View.propTypes.style,
};

export default QRCode;
