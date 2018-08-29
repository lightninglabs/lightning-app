import React, { Component } from 'react';
import {
  TextInput as RNTextInput,
  Text as RNText,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { color, font } from './style';

//
// Base Text Input
//

const baseStyles = StyleSheet.create({
  input: {
    fontFamily: 'OpenSans Regular',
    fontSize: font.sizeM,
    lineHeight: font.lineHeightM + 2 * 12,
    color: color.blackText,
  },
});

export const TextInput = ({ style, ...props }) => (
  <RNTextInput
    style={[baseStyles.input, style]}
    autoCorrect={false}
    autoCapitalize="none"
    underlineColorAndroid="rgba(0,0,0,0)"
    placeholderTextColor={color.greyPlaceholder}
    {...props}
  />
);

TextInput.propTypes = {
  style: RNText.propTypes.style,
};

//
// Horizontal Expanding Text Input
//

export class HorizontalExpandingTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '', width: 0 };
  }
  render() {
    const { value, charWidth, onChangeText, style, ...props } = this.props;
    return (
      <TextInput
        value={value || this.state.text}
        onChangeText={text => {
          this.setState({ text, width: charWidth * (text.length + 1) });
          onChangeText && onChangeText(text);
        }}
        style={[
          style,
          {
            width: Math.max(
              charWidth * 2,
              value ? charWidth * (value.length + 1) : this.state.width
            ),
          },
        ]}
        {...props}
      />
    );
  }
}

HorizontalExpandingTextInput.propTypes = {
  value: PropTypes.string,
  charWidth: PropTypes.number.isRequired,
  onChangeText: PropTypes.func,
  style: RNText.propTypes.style,
};

export default TextInput;
