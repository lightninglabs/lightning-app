import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from '../../component/svg';

const SvgComponent = props => (
  <Svg width={600} height={'100%'} {...props}>
    <Defs>
      <LinearGradient x1="-6.471%" y1="-1%" x2="87.82%" y2="84.696%" id="a">
        <Stop stopColor="#A95BDC" offset="0%" />
        <Stop stopColor="#651399" offset="51.576%" />
        <Stop stopColor="#610F96" offset="70.302%" />
        <Stop stopColor="#610F96" offset="70.302%" />
        <Stop stopColor="#57038D" offset="100%" />
      </LinearGradient>
    </Defs>
    <Path d="M0 0h600v1000H0z" fill="url(#a)" fillRule="evenodd" />
  </Svg>
);

export default SvgComponent;
