import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  SafeAreaView,
  ViewPropTypes,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { SmallPillButton } from './button';
import { Text, H4Text } from './text';
import ToastCheckmarkIcon from '../asset/icon/toast-checkmark';
import { SmallSpinner } from './spinner';
import { color, font } from './style';

//
// NotificationBar
//

const barStyles = StyleSheet.create({
  safe: {
    backgroundColor: color.blackDark,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  bar: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: color.blackDark,
  },
  msgWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alert: {
    marginRight: 8,
  },
  text: {
    fontSize: font.sizeXS,
    lineHeight: font.lineHeightXS,
  },
});

export const NotificationBar = ({ notification, display, style }) =>
  notification && display ? (
    <SafeAreaView style={barStyles.safe}>
      <View style={[barStyles.bar, style]}>
        <View style={barStyles.msgWrapper}>
          <Alert type={notification.type} style={barStyles.alert} />
          <Text style={barStyles.text}>{notification.message}</Text>
        </View>
        {Platform.OS === 'web' && notification.handler ? (
          <SmallPillButton
            text={notification.handlerLbl}
            onPress={notification.handler}
          />
        ) : null}
        {notification.waiting ? <SmallSpinner /> : null}
      </View>
    </SafeAreaView>
  ) : null;

NotificationBar.propTypes = {
  notification: PropTypes.object,
  display: PropTypes.bool.isRequired,
  style: ViewPropTypes.style,
};

//
// Alert
//

export const alertColor = type => {
  return type === 'success'
    ? color.greenSig
    : type === 'error'
    ? color.pinkSig
    : type === 'inactive'
    ? color.greySig
    : color.orangeSig;
};

const alertStyles = StyleSheet.create({
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },
});

export const Alert = ({ type, style }) => (
  <View
    style={[alertStyles.dot, { backgroundColor: alertColor(type) }, style]}
  />
);

Alert.propTypes = {
  type: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

//
// CountBubble
//

const countStyles = StyleSheet.create({
  bubble: {
    paddingTop: 1,
    paddingBottom: 2,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 13,
    backgroundColor: color.pinkSig,
  },
  txt: {
    fontSize: font.sizeXS,
    lineHeight: font.lineHeightXS,
  },
});

export const CountBubble = ({ children, style }) =>
  children && children !== '0' ? (
    <View style={[countStyles.bubble, style]}>
      <H4Text style={countStyles.txt}>{children}</H4Text>
    </View>
  ) : null;

CountBubble.propTypes = {
  children: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

//
// Copied Notification
//

const copiedStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 145,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 65,
    borderRadius: 10,
  },
  text: {
    marginTop: 7,
  },
});

export const CopiedNotification = ({ display, color, style }) => (
  <View style={[copiedStyles.wrapper, style]}>
    <FadeInView display={display}>
      <View style={[copiedStyles.box, { backgroundColor: color }]}>
        <ToastCheckmarkIcon height={17.55} width={16.9} />
        <H4Text style={copiedStyles.text}>Copied to clipboard</H4Text>
      </View>
    </FadeInView>
  </View>
);

CopiedNotification.propTypes = {
  display: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

//
// Fade In View
//

class FadeInView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
    };
  }

  render() {
    if (!this.props.display) {
      return null;
    }
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 250,
    }).start();
    return (
      <Animated.View
        style={{
          ...this.props.style,
          opacity: this.state.fadeAnim,
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

FadeInView.propTypes = {
  display: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
};
