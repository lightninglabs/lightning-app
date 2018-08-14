import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from '../../component/svg';
const OrangeGradientBg = props => (
  <Svg width={'100%'} height={'100%'} {...props}>
    <Defs>
      <LinearGradient
        x1="-19.991%"
        y1="-32.193%"
        x2="39.298%"
        y2="55.702%"
        id="a"
      >
        <Stop stopColor="#FAD961" offset="0%" />
        <Stop stopColor="#F76B1C" offset="100%" />
      </LinearGradient>
    </Defs>
    <Path
      d="M0 41.5h1440V1024H0V271.438z"
      transform="translate(0 -41)"
      fill="url(#a)"
      fillRule="evenodd"
    />
  </Svg>
);

export default OrangeGradientBg;
