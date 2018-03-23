import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from './styles';

const styles = {
  text: {
    color: 'white',
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
    <Text style={styles.text}>{children}</Text>
  </TouchableOpacity>
);

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.string.isRequired,
};

export default Button;
