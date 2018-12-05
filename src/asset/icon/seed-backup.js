import React from 'react';
import Svg, { Defs, Path, G, Circle, Use } from '../../component/svg';

// SVGR has dropped some elements not supported by react-native-svg: filter, feOffset, feGaussianBlur, feColorMatrix, feMerge, feMergeNode
const SvgSeedBackup = props => (
  <Svg
    viewBox="0 0 221 223"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    {...props}
  >
    <Defs>
      <Path
        d="M14.82 32.684h106.16c7.732 0 14 6.268 14 14v134.134c0 7.732-6.268 14-14 14H14.82c-7.732 0-14-6.268-14-14V46.684c0-7.732 6.268-14 14-14z"
        id="b"
      />
    </Defs>
    <G fill="none" fillRule="evenodd">
      <Circle fill="#57038D" cx={15.141} cy={47.771} r={6.374} />
      <Circle fill="#57038D" cx={214.172} cy={68.162} r={6.374} />
      <Circle fill="#57038D" cx={7.287} cy={175.945} r={6.374} />
      <Circle fill="#57038D" cx={196.958} cy={212} r={10.841} />
      <Circle fill="#57038D" cx={175.276} cy={14.119} r={10.841} />
      <Circle fill="#57038D" cx={135.927} cy={8.951} r={2.725} />
      <Circle fill="#57038D" cx={25.538} cy={3.5} r={2.725} />
      <Circle fill="#57038D" cx={194.233} cy={160.157} r={2.725} />
      <Circle fill="#57038D" cx={16.386} cy={143.223} r={2.725} />
      <Circle fill="#57038D" cx={71.296} cy={7.745} r={6.374} />
      <Path
        d="M61 46.081h106.16c7.733 0 14 6.268 14 14v134.135c0 7.732-6.267 14-14 14H61c-7.731 0-14-6.268-14-14V60.08c0-7.732 6.269-14 14-14z"
        fillOpacity={0.168}
        fill="#DCDBDB"
      />
      <G transform="translate(38.181 21.397)">
        <Use fill="#000" filter="url(#a)" href="#b" />
        <Use fill="#DCDBDB" href="#b" />
      </G>
      <Path
        d="M55.594 189.713h50.773M55.594 172.561h101M55.594 155.48h101M55.594 138.398h101M55.594 121.316h101M55.594 104.235h101M55.594 87.153h101"
        strokeOpacity={0.382}
        stroke="#252F4A"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <G filter="url(#c)" transform="rotate(45 73.492 251.724)">
        <Path
          d="M1.581 110.039l4.596 11.335a4.5 4.5 0 0 0 8.34 0l4.596-11.335V8.15a7.5 7.5 0 0 0-7.5-7.5H9.081a7.5 7.5 0 0 0-7.5 7.5V110.04z"
          stroke="#252F4A"
          fill="#E2A56B"
        />
        <Path
          d="M1.581 108.321c1.165.847 1.936 1.315 2.051 1.315.38 0 .794-.225 1.324-.682.114-.098.528-.476.621-.555.295-.25.491-.37.756-.37.573 0 .62.025 1.987.88.808.505 1.366.727 2.027.727.112 0 .227-.007.346-.021.601-.072 1.226-.303 2.095-.731a58.54 58.54 0 0 1 1.133-.56c.433-.196.752-.295 1.048-.295.025 0 .025 0 .049.002.284.02.46.165.686.442.03.037.323.421.42.535.362.424.704.628 1.164.628.313 0 .953-.418 1.825-1.27V8.15a7.5 7.5 0 0 0-7.5-7.5H9.081a7.5 7.5 0 0 0-7.5 7.5v100.171z"
          stroke="#252F4A"
          fill="#F68C1C"
        />
        <Path
          d="M19.613 8.15v100.425c-1.039 1.04-1.814 1.561-2.325 1.561-1.46 0-1.884-1.607-2.319-1.607-.89 0-2.797 1.607-4.622 1.607-1.217 0-1.217-.52 0-1.561V.15h1.266a8 8 0 0 1 8 8z"
          fillOpacity={0.074}
          fill="#252F4A"
        />
        <Path
          d="M1.581 19.862h17.532V8.15a7.5 7.5 0 0 0-7.5-7.5H9.081a7.5 7.5 0 0 0-7.5 7.5v11.712z"
          stroke="#252F4A"
          fill="#F5F5F5"
        />
        <Path
          d="M1.581 15.575h17.532V5.15a4.5 4.5 0 0 0-4.5-4.5H6.081a4.5 4.5 0 0 0-4.5 4.5v10.425z"
          stroke="#252F4A"
          fill="#E3587B"
        />
        <Path
          d="M19.613 4.783v11.292H14.98V.15a4.633 4.633 0 0 1 4.633 4.633z"
          fillOpacity={0.073}
          fill="#252F4A"
        />
        <Path
          d="M15.502 120.278l-4.228 10.428a1 1 0 0 1-1.854 0L5.202 120.3l10.3-.022z"
          fill="#252F4A"
        />
        <Path
          d="M10.528 28.038v57.748M10.485 88.603v16.252"
          stroke="#F5F5F5"
          strokeLinecap="round"
        />
      </G>
    </G>
  </Svg>
);

export default SvgSeedBackup;
