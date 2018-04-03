import React from 'react';
import { TouchableOpacity, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import Icon from './icon';
import { colors } from './style';

//
// Regular Button
//

const styles = StyleSheet.create({
  touchable: {
    height: 75,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'OpenSans Bold',
    letterSpacing: 1,
  },
});

export const Button = ({ onPress, disabled, children, style }) => (
  <TouchableOpacity
    style={[
      { backgroundColor: disabled ? colors.glasDark : colors.glas },
      styles.touchable,
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
    height: 60,
    borderRadius: 58.94,
    backgroundColor: colors.purple,
  },
});

export const PillButton = ({ onPress, disabled, children, style }) => (
  <TouchableOpacity
    style={[
      { opacity: disabled ? 0.5 : 1 },
      styles.touchable,
      pillStyles.touchable,
      style,
    ]}
    disabled={disabled}
    onPress={onPress}
  >
    <Text style={styles.text}>{children}</Text>
  </TouchableOpacity>
);

PillButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

//
// Small Button
//

const smallStyles = StyleSheet.create({
  touchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 15,
    paddingRight: 20,
  },
  text: {
    fontFamily: 'OpenSans SemiBold',
    fontSize: 12,
    marginLeft: 5,
  },
  border: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 58.94,
    borderColor: colors.white,
  },
});

export const SmallButton = ({
  text,
  onPress,
  disabled,
  border,
  children,
  style,
}) => (
  <TouchableOpacity
    style={[
      { opacity: disabled ? 0.5 : 1 },
      smallStyles.touchable,
      border ? smallStyles.border : null,
      style,
    ]}
    disabled={disabled}
    onPress={onPress}
  >
    {children}
    <Text style={smallStyles.text}>{text}</Text>
  </TouchableOpacity>
);

SmallButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  border: PropTypes.bool,
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

//
// Icon Button
//

const iconStyles = StyleSheet.create({
  touchable: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 14,
    width: 14,
  },
});

export const IconButton = ({ image, onPress, disabled, style }) => (
  <TouchableOpacity
    style={[{ opacity: disabled ? 0.5 : 1 }, iconStyles.touchable]}
    disabled={disabled}
    onPress={onPress}
  >
    <Icon image={image} style={[iconStyles.icon, style]} />
  </TouchableOpacity>
);

IconButton.propTypes = {
  image: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
};

//
// Back Button
//

const backStyles = StyleSheet.create({
  icon: {
    height: 14,
    width: 8.4,
  },
});

export const BackButton = ({ onPress }) => (
  <IconButton image="back" onPress={onPress} style={backStyles.icon} />
);

BackButton.propTypes = {
  onPress: PropTypes.func,
};

//
// Cancel Button
//

const cancelStyles = StyleSheet.create({
  icon: {
    height: 14,
    width: 14,
  },
});

export const CancelButton = ({ onPress }) => (
  <IconButton image="cancel" onPress={onPress} style={cancelStyles.icon} />
);

CancelButton.propTypes = {
  onPress: PropTypes.func,
};

//
// QR Button
//

const qrStyles = StyleSheet.create({
  touchable: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 24.375,
    width: 25,
  },
  text: {
    fontSize: 10,
  },
});

export const QrButton = ({ onPress, disabled, style, children }) => (
  <TouchableOpacity
    style={[{ opacity: disabled ? 0.5 : 1 }, qrStyles.touchable, style]}
    disabled={disabled}
    onPress={onPress}
  >
    <Icon image="qr" style={qrStyles.icon} />
    <Text style={qrStyles.text}>{children}</Text>
  </TouchableOpacity>
);

QrButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
  children: PropTypes.string,
};

export default Button;
