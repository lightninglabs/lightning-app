import React from 'react';
import Svg, { Defs, Path, G, Use } from '../../component/svg';

// SVGR has dropped some elements not supported by react-native-svg: filter, feOffset, feGaussianBlur, feColorMatrix
const SvgSeed = props => (
  <Svg
    viewBox="0 0 37 44"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    {...props}
  >
    <Defs>
      <Path
        d="M3.178.25h23.156a3 3 0 0 1 3 3v29.235a3 3 0 0 1-3 3H3.178a3 3 0 0 1-3-3V3.25a3 3 0 0 1 3-3z"
        id="b"
      />
    </Defs>
    <G fill="none" fillRule="evenodd">
      <G transform="translate(4 2)">
        <Use fill="#000" filter="url(#a)" href="#b" />
        <Use fill="#F5F5F5" href="#b" />
      </G>
      <Path
        d="M7.784 31.725h11.034M7.784 28.062h21.95M7.784 24.35h21.95M7.784 20.638h21.95M7.784 16.926h21.95M7.784 13.213h21.95M7.784 9.501h21.95"
        strokeOpacity={0.382}
        stroke="#252F4A"
        strokeLinecap="round"
      />
    </G>
  </Svg>
);

export default SvgSeed;
