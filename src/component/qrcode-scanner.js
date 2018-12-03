import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import PropTypes from 'prop-types';
import Text from './text';
import { color } from './style';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  blank: {
    backgroundColor: color.black,
  },
  noPermission: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white,
  },
  text: {
    color: color.blackText,
    textAlign: 'center',
    maxWidth: 300,
  },
});

export default class QRCodeScanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View style={[styles.wrapper, styles.blank]} />;
    } else if (hasCameraPermission === false) {
      return (
        <View style={[styles.wrapper, styles.noPermission]}>
          <Text style={styles.text}>
            No access to the camera. You must enable permission on your device.
          </Text>
        </View>
      );
    } else {
      return (
        <BarCodeScanner
          onBarCodeScanned={this.props.onQRCodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={styles.wrapper}
        />
      );
    }
  }
}

QRCodeScanner.propTypes = {
  onQRCodeScanned: PropTypes.func.isRequired,
};
