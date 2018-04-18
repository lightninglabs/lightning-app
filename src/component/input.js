import React, { Component } from 'react';
import {
  TextInput as RNTextInput,
  TextPropTypes,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { colors, font } from './style';

//
// Base Text Input
//

const baseStyles = StyleSheet.create({
  input: {
    fontFamily: 'OpenSans Regular',
    fontSize: font.sizeM,
    lineHeight: font.lineHeightM + 2 * 8,
    color: colors.blackText,
    outline: 'none',
  },
});

export const TextInput = ({ style, ...props }) => (
  <RNTextInput
    style={[baseStyles.input, style]}
    autoCorrect={false}
    autoCapitalize="none"
    underlineColorAndroid="rgba(0,0,0,0)"
    placeholderTextColor={colors.greyPlaceholder}
    {...props}
  />
);

TextInput.propTypes = {
  style: TextPropTypes.style,
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
    const { charWidth, onChangeText, style, ...props } = this.props;
    return (
      <TextInput
        {...props}
        onChangeText={text => {
          this.setState({ text, width: charWidth * (text.length + 1) });
          onChangeText && onChangeText(text);
        }}
        style={[style, { width: Math.max(charWidth * 2, this.state.width) }]}
        value={this.state.text}
      />
    );
  }
}

HorizontalExpandingTextInput.propTypes = {
  charWidth: PropTypes.number.isRequired,
  onChangeText: PropTypes.func,
  style: TextPropTypes.style,
};

export default TextInput;
