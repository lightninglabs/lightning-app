import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import PropTypes from 'prop-types';
import Text from './text';
import { color } from './style';

//
// QR Code Scanner
//

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
        <View style={styles.wrapper}>
          <BarCodeScanner
            onBarCodeScanned={this.props.onQRCodeScanned}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            style={styles.wrapper}
          />
          <Corners />
        </View>
      );
    }
  }
}

QRCodeScanner.propTypes = {
  onQRCodeScanned: PropTypes.func.isRequired,
};

//
// Corners
//

const cornerStyles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  corners: {
    height: 250,
    width: 250,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  corner: {
    height: 30,
    width: 30,
    borderColor: color.white,
  },
  topLeft: {
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
});

const Corners = () => (
  <View style={[StyleSheet.absoluteFill, cornerStyles.wrapper]}>
    <View style={cornerStyles.corners}>
      <View style={cornerStyles.row}>
        <View style={[cornerStyles.corner, cornerStyles.topLeft]} />
        <View style={[cornerStyles.corner, cornerStyles.topRight]} />
      </View>
      <View style={cornerStyles.row}>
        <View style={[cornerStyles.corner, cornerStyles.bottomLeft]} />
        <View style={[cornerStyles.corner, cornerStyles.bottomRight]} />
      </View>
    </View>
  </View>
);
