import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import QRImage from 'qr-image';
import { colors } from './style';

const width = 220;
const height = width;

const styles = StyleSheet.create({
  base: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    width: width * 1.2,
    height: height * 1.2,
    margin: 40,
   borderRadius: 13,
  },
});

const QRCode = ({ value, style }) => {
  const uri = `data:image/svg+xml;utf8,${QRImage.imageSync(value, {
    type: 'svg',
  })}`;
  return (
    <View style={[styles.base, style]}>
      <Image source={{ uri: uri, height: height, width: width }} />
    </View>
  );
};

QRCode.propTypes = {
  value: PropTypes.string,
  style: View.propTypes.style,
};

export default QRCode;
