import React from 'react';
import { TouchableOpacity, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { colors } from './styles';

//
// Regular Button
//

const styles = StyleSheet.create({
  text: {
    fontFamily: 'OpenSans Bold',
    letterSpacing: 1,
    textAlign: 'center',
    margin: 30,
  },
});

export const Button = ({ onPress, disabled, children, style }) => (
  <TouchableOpacity
    style={[
      { backgroundColor: disabled ? colors.glasDark : colors.glas },
      style,
    ]}
    disabled={disabled}
    onPress={onPress}
  >
    <Text style={[{ opacity: disabled ? 0.5 : 1 }, styles.text]}>
      {children}
    </Text>
  </TouchableOpacity>
);

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

//
// Pill Button
//

const pillStyles = StyleSheet.create({
  touchable: {
    backgroundColor: colors.purple,
    borderRadius: 58.94,
    alignSelf: 'stretch',
  },
  text: {
    margin: 20,
  },
});

export const ButtonPill = ({ onPress, disabled, children, style }) => (
  <TouchableOpacity
    style={[{ opacity: disabled ? 0.5 : 1 }, pillStyles.touchable, style]}
    disabled={disabled}
    onPress={onPress}
  >
    <Text style={[styles.text, pillStyles.text]}>{children}</Text>
  </TouchableOpacity>
);

ButtonPill.propTypes = Button.propTypes;

export default Button;
