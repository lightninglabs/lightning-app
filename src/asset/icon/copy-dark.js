import React from 'react';
import Svg, { Defs, Path, G, Use } from '../../component/svg';
const CopyDark = props => (
  <Svg
    viewBox="0 0 20 25"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    {...props}
  >
    <Defs>
      <Path id="a" d="M.13.228h10.302v14.248H.13z" />
      <Path id="b" d="M4.314 5.606h10.302v14.248H4.314z" />
    </Defs>
    <G fill="none" fillRule="evenodd">
      <G transform="translate(2.646 2.226)">
        <Use fill="#9B9B9B" href="#a" />
        <Path
          stroke="#000"
          strokeWidth={2}
          d="M-.87-.772h12.302v16.248H-.87z"
        />
      </G>
      <G transform="translate(2.646 2.226)">
        <Use fill="#9B9B9B" href="#b" />
        <Path
          stroke="#000"
          strokeWidth={2}
          d="M3.314 4.606h12.302v16.248H3.314z"
        />
      </G>
    </G>
  </Svg>
);

export default CopyDark;
