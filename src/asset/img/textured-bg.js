import React from 'react';
import Svg, {
  Defs,
  Path,
  LinearGradient,
  Stop,
  G,
  Use,
} from '../../component/svg';

// SVGR has dropped some elements not supported by react-native-svg: mask
const TexturedBg = props => (
  <Svg
    width={'100%'}
    height={'100%'}
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <Defs>
      <Path id="a" d="M0 0h1440v985H0z" />
      <LinearGradient x1="3.901%" y1="4.67%" x2="78.39%" y2="75.478%" id="c">
        <Stop stopColor="#A95BDC" offset="0%" />
        <Stop stopColor="#651399" offset="51.576%" />
        <Stop stopColor="#610F96" offset="70.302%" />
        <Stop stopColor="#610F96" offset="70.302%" />
        <Stop stopColor="#57038D" offset="100%" />
      </LinearGradient>
      <LinearGradient x1="-6.471%" y1="-1%" x2="87.82%" y2="84.696%" id="d">
        <Stop stopColor="#A95BDC" offset="0%" />
        <Stop stopColor="#651399" offset="51.576%" />
        <Stop stopColor="#610F96" offset="70.302%" />
        <Stop stopColor="#610F96" offset="70.302%" />
        <Stop stopColor="#57038D" offset="100%" />
      </LinearGradient>
    </Defs>
    <G fill="none" fillRule="evenodd">
      <G>
        <Use fill="#D8D8D8" href="#a" />
        <G mask="url(#b)" fill="url(#c)">
          <Path d="M-675.395-335.927H84.662v1685.56z" />
          <Path d="M-515.602-335.927h760.056v1685.56z" />
          <Path d="M-355.81-335.927h760.056v1685.56z" />
          <Path d="M-196.018-335.927h760.056v1685.56z" />
          <Path d="M-36.226-338.41H723.83v1685.56z" />
          <Path d="M123.566-338.41h762.262v1690.452z" />
          <Path d="M285.564-338.41h762.262v1690.452z" />
          <Path d="M447.562-338.41h762.262v1690.452z" />
          <Path d="M609.56-338.41h762.262v1690.452z" />
          <Path d="M771.558-338.41h762.262v1690.452z" />
          <Path d="M933.556-338.41h762.262v1690.452z" />
          <Path d="M1095.554-338.41h762.262v1690.452z" />
        </G>
      </G>
      <Path fill="url(#d)" opacity={0.616} d="M0 3h1440v982H0z" />
    </G>
  </Svg>
);

export default TexturedBg;
