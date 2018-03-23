import React from 'react';
import { TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { colors } from './styles';

const styles = {
  text: {
    fontFamily: 'OpenSans Bold',
    textAlign: 'center',
    margin: 30,
  },
};

const Button = ({ onPress, disabled, children, style }) => (
  <TouchableOpacity
    style={[
      { backgroundColor: disabled ? colors.glasDark : colors.glas },
      style,
    ]}
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
  style: ViewPropTypes.style,
};

export default Button;
