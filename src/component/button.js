import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewPropTypes,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import Icon from './icon';
import { colors, font } from './style';

//
// Regular Button
//

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
    minWidth: 60,
  },
});

export const Button = ({ onPress, disabled, children, style }) => (
  <TouchableOpacity
    style={[{ opacity: disabled ? 0.5 : 1 }, styles.touchable, style]}
    disabled={disabled}
    onPress={onPress}
  >
    {children}
  </TouchableOpacity>
);

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

//
// Glas Button
//

const glasStyles = StyleSheet.create({
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

export const GlasButton = ({ onPress, disabled, children, style }) => (
  <TouchableOpacity
    style={[
      { backgroundColor: disabled ? colors.glasDark : colors.glas },
      glasStyles.touchable,
      style,
    ]}
    disabled={disabled}
    onPress={onPress}
  >
    <Text style={[{ opacity: disabled ? 0.5 : 1 }, glasStyles.text]}>
      {children}
    </Text>
  </TouchableOpacity>
);

GlasButton.propTypes = {
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
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 58.94,
    backgroundColor: colors.purple,
  },
});

export const PillButton = ({ onPress, disabled, children, style }) => (
  <TouchableOpacity
    style={[{ opacity: disabled ? 0.5 : 1 }, pillStyles.touchable, style]}
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
    fontSize: font.sizeS,
    marginLeft: 5,
  },
  border: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 58.94,
    borderColor: colors.white,
  },
  alert: {
    position: 'absolute',
    top: -2,
    right: -1,
    height: 10,
    width: 10,
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#8f42c3', // "transparent" border in home screen header
  },
});

export const SmallButton = ({
  text,
  onPress,
  disabled,
  border,
  alert,
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
    {alert ? (
      <View style={[smallStyles.alert, { backgroundColor: alert }]} />
    ) : null}
  </TouchableOpacity>
);

SmallButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  border: PropTypes.bool,
  alert: PropTypes.string,
  children: PropTypes.node,
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

export const BackButton = ({ onPress, disabled, style }) => (
  <Button onPress={onPress} disabled={disabled} style={style}>
    <Icon image="back" style={backStyles.icon} />
  </Button>
);

BackButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
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

export const CancelButton = ({ onPress, disabled, style }) => (
  <Button onPress={onPress} disabled={disabled} style={style}>
    <Icon image="cancel" style={cancelStyles.icon} />
  </Button>
);

CancelButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
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
    fontSize: font.sizeXS,
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

//
// Down Button
//

const downStyles = StyleSheet.create({
  text: {
    fontFamily: 'OpenSans SemiBold',
    fontSize: font.sizeS,
  },
  icon: {
    height: 7.2,
    width: 18.4,
  },
});

export const DownButton = ({ onPress, disabled, style, children }) => (
  <Button onPress={onPress} disabled={disabled} style={style}>
    <Text style={downStyles.text}>{children}</Text>
    <Icon image="arrow-down" style={downStyles.icon} />
  </Button>
);

DownButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
  children: PropTypes.string,
};

export default Button;
