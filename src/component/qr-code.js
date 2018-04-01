import React from 'react';
import { StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  base: {
    alignSelf: 'center',
    height: 220,
    width: 220,
    borderRadius: 10,
    margin: 30,
  },
});

const QRCode = ({ style }) => (
  <Image
    source={require('../../assets/invoice.svg')}
    style={[styles.base, style]}
  />
);

QRCode.propTypes = {
  value: PropTypes.string,
  style: Image.propTypes.style,
};

export default QRCode;
