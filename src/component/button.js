import React from 'react';
import {
  View,
  TouchableOpacity,
  Text as RNText,
  StyleSheet,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import Icon from './icon';
import BackIcon from '../asset/icon/back';
import CancelIcon from '../asset/icon/cancel';
import PlusIcon from '../asset/icon/plus';
import QrIcon from '../asset/icon/qr';
import ShareIcon from '../asset/icon/share';
import { color, font } from './style';

//
// Regular Button
//

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
    minWidth: 60,
    zIndex: 10,
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
// Button Text
//

const textStyles = StyleSheet.create({
  text: {
    fontFamily: 'OpenSans SemiBold',
    fontSize: 14,
  },
});

export const ButtonText = ({ children, style }) => (
  <Text style={[textStyles.text, style]}>{children}</Text>
);

ButtonText.propTypes = {
  children: PropTypes.string.isRequired,
  style: RNText.propTypes.style,
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
      { backgroundColor: disabled ? color.glasDark : color.glas },
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
// Small Glas Button
//

const smallGlasStyles = StyleSheet.create({
  touchable: {
    height: 60,
  },
});

export const SmallGlasButton = ({ style, ...props }) => (
  <GlasButton style={[smallGlasStyles.touchable, style]} {...props} />
);

SmallGlasButton.propTypes = {
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
    backgroundColor: color.purple,
  },
  text: {
    fontFamily: 'OpenSans Bold',
    letterSpacing: 1,
  },
});

export const PillButton = ({ onPress, disabled, children, style }) => (
  <TouchableOpacity
    style={[{ opacity: disabled ? 0.5 : 1 }, pillStyles.touchable, style]}
    disabled={disabled}
    onPress={onPress}
  >
    <Text style={pillStyles.text}>{children}</Text>
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
    borderColor: color.white,
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
// Small Pill Button
//

const smallPillStyles = StyleSheet.create({
  touchable: {
    paddingTop: 3,
    paddingBottom: 4,
    paddingLeft: 15,
    paddingRight: 15,
  },
  text: {
    fontFamily: 'OpenSans Regular',
    fontSize: font.sizeXS,
    lineHeight: font.lineHeightXS,
  },
  border: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 58.94,
    borderColor: color.greyPill,
  },
});

export const SmallPillButton = ({ text, onPress, disabled, style }) => (
  <TouchableOpacity
    style={[
      { opacity: disabled ? 0.5 : 1 },
      smallPillStyles.touchable,
      smallPillStyles.border,
      style,
    ]}
    disabled={disabled}
    onPress={onPress}
  >
    <Text style={smallPillStyles.text}>{text}</Text>
  </TouchableOpacity>
);

SmallPillButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
};

//
// Back Button
//

export const BackButton = ({ onPress, disabled, style }) => (
  <Button onPress={onPress} disabled={disabled} style={style}>
    <BackIcon height={14} width={8.4} />
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

export const CancelButton = ({ onPress, disabled, style }) => (
  <Button onPress={onPress} disabled={disabled} style={style}>
    <CancelIcon height={14} width={14} />
  </Button>
);

CancelButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
};

//
// Add Button
//

export const AddButton = ({ onPress, disabled, style }) => (
  <Button onPress={onPress} disabled={disabled} style={style}>
    <PlusIcon height={16} width={16} />
  </Button>
);

AddButton.propTypes = {
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
    marginRight: 1, // prevent box-shadow blinking when pressing QrButton
    marginLeft: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    <QrIcon height={24.375} width={25} />
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
    marginTop: 4,
    height: 32 * 0.22,
    width: 56 * 0.22,
  },
});

export const DownButton = ({ onPress, disabled, style, children }) => (
  <Button onPress={onPress} disabled={disabled} style={style}>
    <Text style={downStyles.text}>{children}</Text>
    <Icon
      image={require('../asset/icon/arrow-down.png')}
      style={downStyles.icon}
    />
  </Button>
);

DownButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
  children: PropTypes.string,
};

//
// Copy Button
//

const copyStyles = StyleSheet.create({
  touchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    borderRadius: 58.94,
    backgroundColor: color.purple,
    paddingLeft: 35,
    paddingRight: 27,
  },
  textWrapper: {
    flex: 1,
    height: 30,
    borderBottomColor: color.white,
    borderBottomWidth: 1,
  },
  text: {
    fontFamily: 'OpenSans Light',
  },
  iconWrapper: {
    marginLeft: 5,
    marginBottom: 7,
  },
});

export const CopyButton = ({ onPress, icon, children, style }) => (
  <TouchableOpacity onPress={onPress} style={[copyStyles.touchable, style]}>
    <View style={copyStyles.textWrapper}>
      <Text numberOfLines={1} style={copyStyles.text}>
        {children}
      </Text>
    </View>
    <View style={copyStyles.iconWrapper}>{icon}</View>
  </TouchableOpacity>
);

CopyButton.propTypes = {
  onPress: PropTypes.func,
  icon: PropTypes.node,
  children: PropTypes.string,
  style: ViewPropTypes.style,
};

//
// Small Copy Button
//

const smallCopyStyles = StyleSheet.create({
  touchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    backgroundColor: color.purple,
    paddingLeft: 15,
    paddingRight: 15,
  },
  textWrapper: {
    flex: 1,
    height: 30,
    borderBottomColor: color.white,
    borderBottomWidth: 1,
  },
  text: {
    fontFamily: 'OpenSans Light',
    textAlign: 'center',
  },
  iconWrapper: {
    marginLeft: 5,
    marginBottom: 7,
  },
});

export const SmallCopyButton = ({ onPress, icon, children, style }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[smallCopyStyles.touchable, style]}
  >
    <View style={smallCopyStyles.textWrapper}>
      <Text numberOfLines={1} style={smallCopyStyles.text}>
        {children}
      </Text>
    </View>
    <View style={smallCopyStyles.iconWrapper}>{icon}</View>
  </TouchableOpacity>
);

SmallCopyButton.propTypes = {
  onPress: PropTypes.func,
  icon: PropTypes.node,
  children: PropTypes.string,
  style: ViewPropTypes.style,
};

//
// Radio Button
//

const radioStyles = StyleSheet.create({
  selection: {
    height: 14,
    width: 14,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: color.lightPurple,
  },
});

export const RadioButton = ({ selected }) => (
  <View
    style={[
      radioStyles.selection,
      { backgroundColor: selected ? color.lightPurple : color.blackDark },
    ]}
  />
);

RadioButton.propTypes = {
  selected: PropTypes.bool.isRequired,
};

//
// Max Button
//

const maxStyles = StyleSheet.create({
  touchable: {
    borderStyle: 'solid',
    borderWidth: 1,
    minHeight: 0,
    minWidth: 0,
    height: 30,
    width: 50,
  },
});

export const MaxButton = ({ active, style, ...props }) => (
  <Button
    style={[
      { borderColor: active ? color.blackText : color.greyPlaceholder },
      maxStyles.touchable,
      style,
    ]}
    {...props}
  >
    <Text style={{ color: active ? color.blackText : color.greyPlaceholder }}>
      Max
    </Text>
  </Button>
);

MaxButton.propTypes = {
  active: PropTypes.bool.isRequired,
  style: ViewPropTypes.style,
};

//
// Share Button
//

export const ShareButton = ({ onPress, disabled, style }) => (
  <Button onPress={onPress} disabled={disabled} style={style}>
    <ShareIcon height={16} width={14.979} />
  </Button>
);

ShareButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
};

export default Button;
