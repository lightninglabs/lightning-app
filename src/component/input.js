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
// Adjusting Text Input
//

const getCharWidthHeightRatio = (fontWidthHeightRatio, char) =>
  fontWidthHeightRatio[char] || fontWidthHeightRatio['default'];

const calculateWidthAndFontSize = (
  text,
  maxWidth,
  defaultFontSize,
  fontWidthHeightRatio,
  placeholderFirstChar
) => {
  const predictedTextLength = text.length || 1;
  const predictedTextCharArray = text.split('') || [placeholderFirstChar];
  const predictedTextWidth = predictedTextCharArray.reduce(
    (accumulator, currentValue) =>
      getCharWidthHeightRatio(fontWidthHeightRatio, currentValue) *
        defaultFontSize +
      accumulator,
    0
  );
  const calculatedWidth = Math.min(
    maxWidth,
    Math.max(
      predictedTextWidth,
      getCharWidthHeightRatio(fontWidthHeightRatio, placeholderFirstChar) *
        defaultFontSize
    )
  );

  const averageFontWidthHeightRatio =
    predictedTextCharArray.reduce(
      (accumulator, currentValue) =>
        getCharWidthHeightRatio(fontWidthHeightRatio, currentValue) +
        accumulator,
      0
    ) / predictedTextLength;
  const calculatedFontSize =
    calculatedWidth >= maxWidth
      ? Math.min(
          defaultFontSize,
          calculatedWidth / predictedTextLength / averageFontWidthHeightRatio
        )
      : defaultFontSize;

  return { calculatedWidth, calculatedFontSize };
};

export class AdjustingTextInput extends Component {
  constructor(props) {
    super(props);
    const { defaultFontSize, fontWidthHeightRatio, placeholder } = props;
    const placeholderFirstChar = placeholder.length
      ? placeholder.charAt(0)
      : '0';

    this.state = {
      text: '',
      width: defaultFontSize * fontWidthHeightRatio[placeholderFirstChar],
      fontSize: defaultFontSize,
      placeholderFirstChar,
    };

    this.onChangeTextHandler = this.onChangeTextHandler.bind(this);
  }

  onChangeTextHandler(
    changedText,
    maxWidth,
    defaultFontSize,
    fontWidthHeightRatio,
    onChangeText,
    placeholderFirstChar
  ) {
    const { calculatedWidth, calculatedFontSize } = calculateWidthAndFontSize(
      changedText,
      maxWidth,
      defaultFontSize,
      fontWidthHeightRatio,
      placeholderFirstChar
    );

    if (changedText.match(/^(?:[1-9]\d*|0)?(?:\.\d*)?$/)) {
      this.setState({
        text: changedText,
        width: calculatedWidth,
        fontSize: calculatedFontSize,
      });
      onChangeText && onChangeText(changedText);
    }
  }

  render() {
    const {
      value,
      style,
      fontWidthHeightRatio,
      defaultFontSize,
      maxWidth,
      onChangeText,
      ...props
    } = this.props;
    const { text, width, fontSize, placeholderFirstChar } = this.state;
    const calculatedStyle = [
      style,
      {
        width,
        fontSize,
      },
    ];

    return (
      <TextInput
        value={value || text}
        onChangeText={changedText =>
          this.onChangeTextHandler(
            changedText,
            maxWidth,
            defaultFontSize,
            fontWidthHeightRatio,
            onChangeText,
            placeholderFirstChar
          )
        }
        style={calculatedStyle}
        {...props}
      />
    );
  }
}

AdjustingTextInput.propTypes = {
  value: PropTypes.string,
  fontWidthHeightRatio: PropTypes.object.isRequired,
  defaultFontSize: PropTypes.number.isRequired,
  maxWidth: PropTypes.number.isRequired,
  onChangeText: PropTypes.func,
  style: RNText.propTypes.style,
  placeholder: PropTypes.string,
};

AdjustingTextInput.defaultProps = {
  placeholder: '0',
};

export default TextInput;
