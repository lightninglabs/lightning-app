import { Component } from 'react';
import PropTypes from 'prop-types';

class Escapable extends Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this.handleKeyDown);
    }
  }

  componentWillUnmount() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  handleKeyDown(event) {
    if (event.keyCode === 27) {
      this.props.onClose();
    }
  }
}

Escapable.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Escapable;
