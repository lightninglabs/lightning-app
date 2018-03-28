import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from './text';
import { View, TextInput } from 'react-native';
import { colors } from './styles';

class ComponentTextInput extends Component {
  render() {
    const {
      value,
      onChangeText,
      placeholder,
      editable,
      rightText,
      style,
    } = this.props;

    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          margin: 4,
          marginTop: 16,
          shadowRadius: 4,
          shadowOpacity: 0.3,
          shadowColor: 'black',
          shadowOffset: { width: 1, height: 1 },
          ...style,
        }}
      >
        <TextInput
          placeholder={placeholder}
          value={value}
          editable={editable}
          onChangeText={text => onChangeText && onChangeText(text)}
          style={{
            flex: 1,
            marginLeft: 16,
            fontSize: 18,
            height: 50,
          }}
        />
        {!!rightText && (
          <View
            style={{
              width: 1,
              backgroundColor: colors.lightergray,
              margin: 8,
              marginRight: 0,
            }}
          />
        )}
        {!!rightText && (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{
                color: colors.lightgray,
                marginLeft: 14,
                marginRight: 14,
              }}
            >
              {rightText}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

ComponentTextInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  editable: PropTypes.bool,
  rightText: PropTypes.string,
  style: PropTypes.object,
};

export default ComponentTextInput;
