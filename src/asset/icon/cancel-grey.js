import React from 'react';
import Svg, { Path } from '../../component/svg';
const CancelGrey = props => (
  <Svg viewBox="0 0 18 18" width="1em" height="1em" {...props}>
    <Path
      d="M7.284 9.088L.831 2.635a1.14 1.14 0 0 1 1.613-1.613l6.453 6.453 6.453-6.453a1.14 1.14 0 0 1 1.613 1.613L10.51 9.088l6.453 6.453a1.14 1.14 0 0 1-1.613 1.613L8.897 10.7l-6.453 6.453A1.14 1.14 0 0 1 .831 15.54l6.453-6.453z"
      fill="#252F4A"
      fillRule="evenodd"
      fillOpacity={0.65}
    />
  </Svg>
);

export default CancelGrey;
