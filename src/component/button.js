import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { TextB } from './text';
import { colors } from './styles';

const styles = {
  text: {
    textAlign: 'center',
    margin: 30,
  },
};

const Button = ({ onPress, disabled, children }) => (
  <TouchableOpacity
    style={{ backgroundColor: disabled ? colors.glasDark : colors.glas }}
    disabled={disabled}
    onPress={onPress}
  >
    <TextB style={styles.text}>{children}</TextB>
  </TouchableOpacity>
);

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.string.isRequired,
};

export default Button;
