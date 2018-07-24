import { Component } from 'react';
import PropTypes from 'prop-types';

class Escapable extends Component {
  componentDidMount() {
    if (document) {
      document.addEventListener('keydown', e => this.handleKeyDown(e));
    }
  }

  componentWillUnmount() {
    if (document) {
      document.removeEventListener('keydown', e => this.handleKeyDown(e));
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
