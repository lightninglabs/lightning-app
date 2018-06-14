import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ART,
} from 'react-native';
import PropTypes from 'prop-types';
import { color } from './style';

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
    size="small"
    color={color.purple}
    style={smallStyles.spinner}
    {...props}
  />
);

//
// Timed Spinner
//
const { Surface, Shape, Path, Group } = ART;
const width = 10;
const linecap = 'butt';
const spinnerColor = color.purple;

export const TimedSpinner = ({ size, percent }) => (
  <View>
    <Surface width={size} height={size}>
      <Group rotation={0} originX={size / 2} originY={size / 2}>
        <Shape d={calcCirclePath(size, percent)}
               stroke={spinnerColor}
               strokeWidth={width}
               strokeCap={linecap}/>
      </Group>
    </Surface>
  </View>
);

TimedSpinner.propTypes = {
  size: PropTypes.number,
  percent: PropTypes.number.isRequired,
};

const calcCirclePath = (size, percent) => {
  const fill = extractFill(percent);
  return getCirclePath(
    size / 2,
    size / 2,
    size / 2 - width / 2,
    0,
    360 * .9999 * fill / 100
  );
};

const getCirclePath = (cx, cy, r, startDegree, endDegree) => {
  let endDegreeInRadians = endDegree * Math.PI / 180;
  let p = Path();
  p.move(cx + r, cy);
  p.arc(
    -r + r * Math.cos(endDegreeInRadians),
    r * Math.sin(endDegreeInRadians),
    r,
    r,
    endDegree >= 180
  );
  return p;
};

const extractFill = fill => {
  if (fill < 0.01) {
    return 0;
  } else if (fill > 100) {
    return 100;
  }
  return fill;
};
