import React, { Component } from 'react';
import { Animated, StyleSheet, ViewPropTypes, View } from 'react-native';
import PropTypes from 'prop-types';
import { SmallPillButton } from './button';
import { Text, H4Text } from './text';
import Icon from './icon';
import { color, font } from '../component/style';

//
// NotificationBar
//

const barStyles = StyleSheet.create({
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
    <View style={[barStyles.bar, style]}>
      <View style={barStyles.msgWrapper}>
        <Alert
          color={notification.type === 'info' ? color.orangeSig : color.pinkSig}
          style={barStyles.alert}
        />
        <Text style={barStyles.text}>{notification.message}</Text>
      </View>
      {notification.handler ? (
        <SmallPillButton
          text={notification.handlerLbl}
          onPress={notification.handler}
        />
      ) : null}
    </View>
  ) : null;

NotificationBar.propTypes = {
  notification: PropTypes.object,
  display: PropTypes.bool.isRequired,
  style: View.propTypes.style,
};

//
// Alert
//

const alertStyles = StyleSheet.create({
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },
});

export const Alert = ({ color, style }) => (
  <View style={[alertStyles.dot, { backgroundColor: color }, style]} />
);

Alert.propTypes = {
  color: PropTypes.string.isRequired,
  style: View.propTypes.style,
};

//
// CountBubble
//

const countStyles = StyleSheet.create({
  bubble: {
    fontSize: font.sizeXS,
    lineHeight: font.lineHeightXS,
    paddingTop: 1,
    paddingBottom: 2,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 13,
    backgroundColor: color.pinkSig,
  },
});

export const CountBubble = ({ children, style }) => (
  <H4Text style={[countStyles.bubble, style]}>{children}</H4Text>
);

CountBubble.propTypes = {
  children: PropTypes.string.isRequired,
  style: View.propTypes.style,
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
  checkIcon: {
    height: 27 * 0.65,
    width: 26 * 0.65,
    marginBottom: 7,
  },
});

export const CopiedNotification = ({ display, color, style }) => (
  <View style={[copiedStyles.wrapper, style]}>
    <FadeInView display={display}>
      <View style={[copiedStyles.box, { backgroundColor: color }]}>
        <Icon image="toast-checkmark" style={copiedStyles.checkIcon} />
        <H4Text>Copied to clipboard</H4Text>
      </View>
    </FadeInView>
  </View>
);

CopiedNotification.propTypes = {
  display: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  style: View.propTypes.style,
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
