import React from 'react';
import Svg, { Defs, Path, G, Mask, Use } from '../../component/svg';

const PasswordHide = props => (
  <Svg
    viewBox="0 0 24 23"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    {...props}
  >
    <Defs>
      <Path
        d="M23.925 11.6C23.725 11.2 19.515 3 12 3 4.484 3 .276 11.2.075 11.6c-.1.3-.1.6 0 .9.2.3 4.41 8.5 11.925 8.5 7.516 0 11.724-8.2 11.925-8.6.1-.2.1-.6 0-.8zM12 19c-5.411 0-8.919-5.4-9.92-7C2.98 10.4 6.588 5 12 5s8.919 5.4 9.92 7c-1.001 1.6-4.509 7-9.92 7zm0-11c-2.205 0-4.008 1.8-4.008 4S9.795 16 12 16s4.008-1.8 4.008-4S14.205 8 12 8zm0 6c-1.102 0-2.004-.9-2.004-2s.902-2 2.004-2c1.102 0 2.004.9 2.004 2s-.902 2-2.004 2z"
        id="a"
      />
    </Defs>
    <G fill="none" fillRule="evenodd">
      <G opacity={0.5} transform="translate(.034 -.575)">
        <Mask id="b" fill="#fff">
          <Use xlinkHref="#a" />
        </Mask>
        <Use fill="#000" fillRule="nonzero" xlinkHref="#a" />
        <G mask="url(#b)" fill="#000">
          <Path d="M0 0h24v24H0z" />
        </G>
      </G>
      <Path
        d="M18.378 1.208l2.332 1.888L5.69 21.643l-2.33-1.888L18.377 1.208z"
        stroke="#F5F5F5"
        fill="#7A7A7A"
      />
    </G>
  </Svg>
);

export default PasswordHide;
