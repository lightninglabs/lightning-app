import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { color, font } from './style';
import Icon from '../component/icon';
import Text from '../component/text';
import Svg, {
  Path,
  Circle,
  Defs,
  Stop,
  LinearGradient,
} from '../component/svg';

//
// Small Spinner
//

const smallStyles = StyleSheet.create({
  spinner: {
    transform: [{ scale: 1.42 }],
  },
});
export const SmallSpinner = ({ ...props }) => (
  <ActivityIndicator
    sizeM="small"
    color={color.purple}
    style={smallStyles.spinner}
    {...props}
  />
);

//
// Load Network Spinner
//

const sizeM = 121;
const progressWidthM = 5;

const loadNetworkStyles = StyleSheet.create({
  spinner: {
    margin: 20,
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bolt: {
    height: 32,
    width: 16,
  },
  copy: {
    fontSize: font.sizeS,
    marginTop: 10,
    color: color.white,
    textAlign: 'center',
  },
});

export const LoadNetworkSpinner = ({ percentage, msg, style }) => (
  <View style={[loadNetworkStyles.spinner, style]}>
    <View style={{ width: sizeM, height: sizeM }}>
      <Svg width={sizeM} height={sizeM}>
        <LoadNetworkGradient />
        <Path
          d={`M${sizeM / 2} ${sizeM / 2} L${sizeM / 2} 0 ${generateArc(
            percentage,
            sizeM / 2
          )} Z`}
          fill="url(#linearGrad)"
        />
        {
          <Circle
            cx={sizeM / 2}
            cy={sizeM / 2}
            r={sizeM / 2 - progressWidthM}
            fill={color.blackDark}
          />
        }
      </Svg>
      <View style={loadNetworkStyles.fill}>
        <Icon image="lightning-bolt" style={loadNetworkStyles.bolt} />
      </View>
    </View>
    <Text style={loadNetworkStyles.copy}>{msg}</Text>
  </View>
);

const LoadNetworkGradient = () => (
  <Defs>
    <LinearGradient id="linearGrad" x1="0" y1="0" x2="1" y2="1">
      <Stop offset="0%" stopColor={color.spinnerLightPurple} />
      <Stop offset="50%" stopColor={color.spinnerMedPurple} />
      <Stop offset="70%" stopColor={color.spinnerMedDarkPurple} />
      <Stop offset="100%" stopColor={color.purple} />
    </LinearGradient>
  </Defs>
);

LoadNetworkSpinner.propTypes = {
  percentage: PropTypes.number.isRequired,
  msg: PropTypes.string.isRequired,
  style: PropTypes.object,
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
