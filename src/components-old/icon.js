import React from 'react';
import PropTypes from 'prop-types';
import icons from './icons';

const ComponentIcon = ({ icon, style }) => (
  <svg viewBox="0 0 24 24" style={style}>
    {icons(icon)}
  </svg>
);

ComponentIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default ComponentIcon;
