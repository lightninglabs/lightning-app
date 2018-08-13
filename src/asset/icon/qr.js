import React from 'react';
import Svg, { G, Rect, Path } from '../../component/svg';
const Qr = props => (
  <Svg viewBox="0 0 40 39" width="1em" height="1em" {...props}>
    <G transform="translate(.948 .387)" fill="none" fillRule="evenodd">
      <Rect
        stroke="#FFF"
        strokeWidth={2}
        x={1}
        y={1}
        width={15.59}
        height={15.59}
        rx={3}
      />
      <Rect
        stroke="#FFF"
        strokeWidth={2}
        x={21.889}
        y={1}
        width={15.59}
        height={15.59}
        rx={3}
      />
      <Rect
        stroke="#FFF"
        strokeWidth={2}
        x={1}
        y={21.889}
        width={15.59}
        height={15.59}
        rx={3}
      />
      <Rect
        fill="#FFF"
        x={5.497}
        y={5.497}
        width={6.596}
        height={6.596}
        rx={1}
      />
      <Rect
        fill="#FFF"
        x={26.386}
        y={5.497}
        width={6.596}
        height={6.596}
        rx={1}
      />
      <Path
        d="M27.994 23.087h-4.907v4.398H20.89v-6.596h9.304V25.287h7.105v2.198h-9.304v-4.398zM30.193 36.28h4.906v-4.397h2.199v6.596h-9.304V34.08h-7.105v-2.198h9.304v4.397z"
        fill="#FFF"
      />
      <Rect
        fill="#FFF"
        x={5.497}
        y={26.386}
        width={6.596}
        height={6.596}
        rx={1}
      />
    </G>
  </Svg>
);

export default Qr;
