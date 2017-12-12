import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';

class ComponentModal extends Component {
  render() {
    const { children, show, onPress } = this.props;
    if (!show) return <View />;

    return (
      <TouchableOpacity
        onPress={() => onPress()}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(1,1,1,0.3)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </TouchableOpacity>
    );
  }
}

ComponentModal.propTypes = {
  children: PropTypes.any,
  show: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default ComponentModal;
