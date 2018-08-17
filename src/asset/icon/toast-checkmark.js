import React from 'react';
import Svg, { G, Circle, Path } from '../../component/svg';
const ToastCheckmark = props => (
  <Svg viewBox="0 0 26 27" width="1em" height="1em" {...props}>
    <G stroke="#FFF" strokeWidth={2} fill="none" fillRule="evenodd">
      <Circle cx={12} cy={12.535} r={12} transform="translate(1 1)" />
      <Path strokeLinecap="round" d="M7.5 13.535l3.051 4 7.949-8" />
    </G>
  </Svg>
);

export default ToastCheckmark;
