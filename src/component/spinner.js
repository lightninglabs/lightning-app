import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import { color } from './style';
import Icon from './icon';
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
  icon,
  iconStyles,
}) => (
  <View style={{ width: size, height: size }}>
    <Svg width={size} height={size}>
      <Gradients />
      <SpinnerProgress
        width={size}
        percentage={percentage}
        color={`url(#${gradient})`}
      />
      {
        <SpinnerFill
          spinnerWidth={size}
          progressWidth={progressWidth}
          color={color.blackDark}
        />
      }
    </Svg>
    <View style={resizeableStyles.iconWrapper}>
      <Icon image={icon} style={iconStyles} />
    </View>
  </View>
);

ResizeableSpinner.propTypes = {
  percentage: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  progressWidth: PropTypes.number.isRequired,
  gradient: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  iconStyles: ViewPropTypes.style,
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
    percentage = 1;
  } else if (percentage === 100) {
    percentage = 99.999;
  }
  const a = percentage * 2 * Math.PI / 100; // angle (in radian) depends on percentage
  const r = radius; // radius of the circle
  var rx = r,
    ry = r,
    xAxisRotation = 0,
    largeArcFlag = 1,
    sweepFlag = 1,
    x = r + r * Math.sin(a),
    y = r - r * Math.cos(a);
  if (percentage <= 50) {
    largeArcFlag = 0;
  } else {
    largeArcFlag = 1;
  }

  return `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`;
};
