import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from './text';
import { View, TouchableOpacity } from 'react-native';
import { colors } from './styles';

class ComponentButton extends Component {
  render() {
    const { disabled, text, onPress, showClear, onClear } = this.props;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          margin: 4,
          marginTop: 12,
        }}
      >
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

        {showClear && (
          <TouchableOpacity style={{}} onPress={() => onClear && onClear()}>
            <Text
              style={{ color: colors.lightgray, margin: 10, marginLeft: 20 }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

ComponentButton.propTypes = {
  disabled: PropTypes.bool,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  showClear: PropTypes.bool,
  onClear: PropTypes.func,
};

export default ComponentButton;
