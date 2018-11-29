import React, { Component } from 'react';
import { TextInput as RNTextInput, Text as RNText } from 'react-native';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from '../component/media-query';
import { color, font, breakWidth } from './style';

//
// Base Text Input
//

const baseStyles = {
  input: {
    fontFamily: 'OpenSans Regular',
    fontSize: font.sizeM,
    lineHeight: font.lineHeightM + 3,
    height: font.lineHeightM + 2 * 12,
    color: color.blackText,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(breakWidth, {
    input: {
      lineHeight: undefined,
    },
  })
);

export class TextInput extends Component {
  componentDidUpdate(prevProps) {
    const { autoFocus } = this.props;
    prevProps.autoFocus === false && autoFocus && this._input.focus();
  }

  render() {
    const { style, ...props } = this.props;
    return (
      <RNTextInput
        style={[styles.input, style]}
        autoCorrect={false}
        autoCapitalize="none"
        underlineColorAndroid="rgba(0,0,0,0)"
        placeholderTextColor={color.greyPlaceholder}
        ref={component => (this._input = component)}
        {...props}
      />
    );
  }
}

TextInput.propTypes = {
  style: RNText.propTypes.style,
  autoFocus: PropTypes.bool,
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
