import React from 'react'
import reactCSS from 'reactcss'
import { remote } from 'electron'
import { connect } from 'react-redux'
import { actions as notificationActions } from 'lightning-notifications'

import { Box } from 'lightning-components'
import { Popup, actions as popupActions } from 'lightning-popup'
import { actions } from './reducer'
import { Prompt } from '../common'

const { Menu, MenuItem } = remote

export const ChannelListItem = ({ id, capacity, localBalance, remoteBalance,
  channelPoint, onShowPopup, onClosePopup, onCloseChannel, onSuccess }) => {
  const styles = reactCSS({
    'default': {
      channel: {
        borderBottom: '1px solid #ddd',
        paddingTop: 20,
        paddingBottom: 20,
      },
      split: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 7,
      },
      id: {
        color: '#333',
        fontSize: 20,
      },
      status: {
        fontSize: 13,
        textTransform: 'uppercase',
        color: '#999',
      },
      local: {
        fontSize: 16,
        color: '#4990E2',
      },
      remote: {
        fontSize: 16,
        color: '#666',
      },
      bar: {
        borderRadius: 2,
        background: 'lighter-gray',
        marginTop: 10,
      },
      percent: {
        background: 'blue',
        height: 12,
        borderRadius: 2,
      },
    },
  })

  const PROMPT = 'CHANNEL_LIST/PROMPT'

  const menu = new Menu()
  menu.append(new MenuItem({ label: 'Close Channel', click() { onShowPopup(PROMPT) } }))
  const handleMenu = () => menu.popup(remote.getCurrentWindow())
  const handleClose = () => {
    onCloseChannel({ channelPoint })
      .then(() => onSuccess('Channel Closed'))
      .catch(err => onSuccess(err.message))
    onClosePopup(PROMPT)
  }
  const handleCancel = () => onClosePopup(PROMPT)

  const width = `${ (localBalance / capacity) * 100 }%`

  return (
    <div style={ styles.channel } onContextMenu={ handleMenu }>
      <div style={ styles.split }>
        <div style={ styles.id }>{ id }</div>
        <div style={ styles.status }>{ status }</div>
      </div>

      <div style={ styles.split }>
        <div style={ styles.local }>My Balance: { localBalance }</div>
        <div style={ styles.remote }>Avaliable to Recieve: { remoteBalance }</div>
      </div>

      <Box style={ styles.bar }>
        <Box style={ styles.percent } width={ width } />
      </Box>

      <Popup name={ PROMPT }>
        <Prompt
          title="Close Channel"
          prompt="Are you sure you want to close this channel? It may take a while to get your funds back."
          acceptLabel="Yes, Close Channel"
          onAccept={ handleClose }
          cancelLabel="Cancel"
          onCancel={ handleCancel }
        />
      </Popup>
    </div>
  )
}

export default connect(
  () => ({}), {
    onShowPopup: popupActions.onOpen,
    onClosePopup: popupActions.onClose,
    onCloseChannel: actions.closeChannel,
    onSuccess: notificationActions.addNotification,
  }
)(ChannelListItem)
