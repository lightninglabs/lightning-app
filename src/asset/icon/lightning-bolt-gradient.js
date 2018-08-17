import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from '../../component/svg';
const LightningBoltGradient = props => (
  <Svg viewBox="0 0 95 172" width="1em" height="1em" {...props}>
    <Defs>
      <LinearGradient x1="23.555%" y1="100%" x2="77.972%" y2="0%" id="a">
        <Stop stopColor="#A540CD" offset="0%" />
        <Stop stopColor="#6B249C" offset="100%" />
      </LinearGradient>
    </Defs>
    <Path
      d="M76.624 0L.31 97.734a1 1 0 0 0 .789 1.615h42.913L19.202 172l75.55-96.18a1 1 0 0 0-.786-1.618h-46.43L76.624 0z"
      fill="url(#a)"
      fillRule="evenodd"
    />
  </Svg>
);

export default LightningBoltGradient;
