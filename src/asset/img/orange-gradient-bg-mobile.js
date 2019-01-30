import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from '../../component/svg';

const SvgOrangeGradientBgMobile = props => (
  <Svg width={600} height={'100%'} {...props}>
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
    <Path d="M0 0h600v1000H0z" fill="url(#a)" fillRule="evenodd" />
  </Svg>
);

export default SvgOrangeGradientBgMobile;
