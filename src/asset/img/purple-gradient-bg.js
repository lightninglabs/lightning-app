import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from '../../component/svg';
const PurpleGradientBg = props => (
  <Svg width={'100%'} height={'100%'} {...props}>
    <Defs>
      <LinearGradient x1="-6.471%" y1="-1%" x2="87.82%" y2="84.696%" id="a">
        <Stop stopColor="#A95BDC" offset="0%" />
        <Stop stopColor="#651399" offset="51.576%" />
        <Stop stopColor="#610F96" offset="70.302%" />
        <Stop stopColor="#610F96" offset="70.302%" />
        <Stop stopColor="#57038D" offset="100%" />
      </LinearGradient>
    </Defs>
    <Path
      d="M0 41.5h1440V1024H0z"
      transform="translate(0 -41)"
      fill="url(#a)"
      fillRule="evenodd"
    />
  </Svg>
);

export default PurpleGradientBg;
