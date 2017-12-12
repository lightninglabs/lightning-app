import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, TextB } from '../components/text';
import { Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../styles';

class ComponentButton extends Component {
  render() {
    const { disabled, text, onPress } = this.props;

    return (
      <TouchableOpacity
        disabled={disabled}
        style={{
          backgroundColor: disabled ? colors.lightergray : colors.blue,
        }}
        onPress={() => onPress()}
      >
        <Text style={{ color: 'white', textAlign: 'center', margin: 18 }}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

ComponentButton.propTypes = {
  disabled: PropTypes.bool,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default ComponentButton;
