import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import { color, font } from './style';
import Icon from './icon';
import Text from './text';
import Svg, { Path, Circle, Defs, Stop, LinearGradient } from './svg';

//
// Small Spinner
//

const smallStyles = StyleSheet.create({
  spinner: {
    transform: [{ scale: 1.0 }],
  },
});

export const SmallSpinner = ({ ...props }) => (
  <ActivityIndicator
    size="small"
    color={color.lightPurple}
    style={smallStyles.spinner}
    {...props}
  />
);

//
// Wait Spinner
//

const waitStyles = StyleSheet.create({
  bolt: {
    height: 126 / 4.5,
    width: 64 / 4.5,
  },
  copy: {
    fontSize: font.sizeXS,
    marginTop: 5,
    color: color.white,
    textAlign: 'center',
  },
});

export class WaitSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loopAnim: new Animated.Value(0),
    };
  }

  render() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.loopAnim, {
          toValue: 1,
          duration: 1075,
          easing: Easing.linear,
        }),
      ])
    ).start();
    const spin = this.state.loopAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const reverseSpin = this.state.loopAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['360deg', '0deg'],
    });
    return (
      <View>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <ResizeableSpinner
            percentage={0.5}
            size={80}
            progressWidth={3}
            gradient="loadNetworkGrad"
          >
            <Animated.View style={{ transform: [{ rotate: reverseSpin }] }}>
              <Icon image="lightning-bolt" style={waitStyles.bolt} />
            </Animated.View>
          </ResizeableSpinner>
        </Animated.View>
        <Text style={waitStyles.copy}>{this.props.msg}</Text>
      </View>
    );
  }
}

WaitSpinner.propTypes = {
  msg: PropTypes.string,
};

//
// Load Network Spinner
//

const loadNetworkStyles = StyleSheet.create({
  bolt: {
    height: 126 / 4.5,
    width: 64 / 4.5,
  },
  copy: {
    fontSize: font.sizeXS,
    marginTop: 5,
    color: color.white,
    textAlign: 'center',
  },
});

export const LoadNetworkSpinner = ({ percentage, msg, style }) => (
  <View style={style}>
    <ResizeableSpinner
      percentage={percentage}
      size={80}
      progressWidth={3}
      gradient="loadNetworkGrad"
    >
      <Icon image="lightning-bolt" style={loadNetworkStyles.bolt} />
    </ResizeableSpinner>
    <Text style={loadNetworkStyles.copy}>{msg}</Text>
  </View>
);

LoadNetworkSpinner.propTypes = {
  percentage: PropTypes.number.isRequired,
  msg: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

//
// Resizeable Spinner
//

const resizeableStyles = StyleSheet.create({
  iconWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const ResizeableSpinner = ({
  percentage,
  size,
  gradient,
  progressWidth,
  children,
}) => (
  <View style={{ width: size, height: size }}>
    <Svg width={size} height={size}>
      <Gradients />
      <SpinnerProgress
        width={size}
        percentage={percentage}
        color={`url(#${gradient})`}
      />
      <SpinnerFill
        spinnerWidth={size}
        progressWidth={progressWidth}
        color={color.blackDark}
      />
    </Svg>
    <View style={resizeableStyles.iconWrapper}>{children}</View>
  </View>
);

ResizeableSpinner.propTypes = {
  percentage: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  progressWidth: PropTypes.number.isRequired,
  gradient: PropTypes.string.isRequired,
  children: PropTypes.node,
};

//
// Loading Network Gradient
//

const Gradients = () => (
  <Defs>
    <LinearGradient id="loadNetworkGrad" x1="0" y1="0" x2="1" y2="1">
      <Stop offset="0%" stopColor={color.loadNetworkLightPurple} />
      <Stop offset="50%" stopColor={color.loadNetworkMedPurple} />
      <Stop offset="70%" stopColor={color.loadNetworkMedDarkPurple} />
      <Stop offset="100%" stopColor={color.purple} />
    </LinearGradient>
    <LinearGradient id="openChannelsGrad" x1="0" y1="0" x2="1" y2="1">
      <Stop offset="0%" stopColor={color.lightPurple} />
      <Stop offset="50%" stopColor={color.openChansDarkPurple} />
    </LinearGradient>
  </Defs>
);

//
// Spinner Progress Path
//

const SpinnerProgress = ({ width, percentage, color }) => (
  <Path
    d={`M${width / 2} ${width / 2} L${width / 2} 0 ${generateArc(
      percentage,
      width / 2
    )} Z`}
    fill={color}
  />
);

SpinnerProgress.propTypes = {
  width: PropTypes.number.isRequired,
  percentage: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

//
// Spinner Fill
//

const SpinnerFill = ({ spinnerWidth, progressWidth, color }) => (
  <Circle
    cx={spinnerWidth / 2}
    cy={spinnerWidth / 2}
    r={spinnerWidth / 2 - progressWidth}
    fill={color}
  />
);

SpinnerFill.propTypes = {
  spinnerWidth: PropTypes.number.isRequired,
  progressWidth: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

const generateArc = (percentage, radius) => {
  if (percentage === 0) {
    percentage = 0.001;
  } else if (percentage === 1) {
    percentage = 0.9999;
  }
  const a = percentage * 2 * Math.PI; // angle (in radian) depends on percentage
  const r = radius; // radius of the circle
  var rx = r,
    ry = r,
    xAxisRotation = 0,
    largeArcFlag = 1,
    sweepFlag = 1,
    x = r + r * Math.sin(a),
    y = r - r * Math.cos(a);
  if (percentage <= 0.5) {
    largeArcFlag = 0;
  } else {
    largeArcFlag = 1;
  }

  return `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`;
};
