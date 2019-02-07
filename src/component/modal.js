import React from 'react';
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from './button';
import { H4Text } from './text';
import CancelGreyIcon from '../asset/icon/cancel-grey';
import Escapable from './escapable';
import { color } from './style';

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    backgroundColor: color.whiteBg,
    width: 430,
    borderRadius: 15,
    paddingTop: 20,
    paddingBottom: 30,
    paddingLeft: 25,
    paddingRight: 25,
  },
  title: {
    color: color.blackText,
    marginBottom: 10,
  },
  cancelBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 52,
    minHeight: 52,
  },
});

class Modal extends Escapable {
  render() {
    const { title = '', style, onClose, children } = this.props;
    return (
      <View style={[styles.modal, style]}>
        <H4Text style={styles.title}>{title.toUpperCase()}</H4Text>
        <Button style={styles.cancelBtn} onPress={onClose}>
          <CancelGreyIcon height={12} width={12} />
        </Button>
        {children}
      </View>
    );
  }
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

export default Modal;
