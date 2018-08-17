import React from 'react';
import Svg, { G, Path } from '../../component/svg';
const Cancel = props => (
  <Svg viewBox="0 0 21 21" width="1em" height="1em" {...props}>
    <G fill="none" fillRule="evenodd">
      <Path
        d="M8.926 10.089L1.257 2.42A1.356 1.356 0 0 1 3.175.503l7.668 7.669 7.67-7.67A1.356 1.356 0 1 1 20.43 2.42l-7.67 7.669 7.67 7.669a1.356 1.356 0 0 1-1.918 1.917l-7.669-7.669-7.668 7.67a1.356 1.356 0 0 1-1.918-1.918l7.67-7.67z"
        fill="#FFF"
      />
    </G>
  </Svg>
);

export default Cancel;
