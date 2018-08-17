import React from 'react';
import Svg, { G, Rect } from '../../component/svg';
const Plus = props => (
  <Svg viewBox="0 0 14 14" width="1em" height="1em" {...props}>
    <G fill="#FFF" fillRule="evenodd">
      <Rect x={6.58} y={0.599} width={1.335} height={13.349} rx={0.667} />
      <Rect
        transform="rotate(90 7.247 7.273)"
        x={6.58}
        y={0.599}
        width={1.335}
        height={13.349}
        rx={0.667}
      />
    </G>
  </Svg>
);

export default Plus;
