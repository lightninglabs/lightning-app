import React from 'react'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { store } from 'lightning-store'
import { actions } from './reducer'

export const Popup = ({ children, visible, onClose, name }) => {
  const styles = reactCSS({
    'default': {
      wrap: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      cover: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'rgba(39, 36, 41, 0.7)',
      },
      box: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      },
    },
  })

  const handleClose = () => onClose(name)

  return visible ? (
    <div style={ styles.wrap }>
      <div style={ styles.cover } onClick={ handleClose } />
      <div style={ styles.box }>
        { children }
      </div>
    </div>
  ) : null
}

export default connect(
  (state, ownProps) => ({
    visible: store.getPopupVisibility(state, ownProps.name),
  }),
  actions,
)(Popup)
