import React from 'react'
import reactCSS from 'reactcss'
import { remote } from 'electron'
import { Popup } from 'lightning-popup'
import { QRCode } from 'lightning-components'
import { Head, Input } from '../common'

const { Menu, MenuItem } = remote

export const POPUP_NAME = 'paymentRequest'

export const PaymentRequestPopup = ({ paymentRequest, closePopup }) => {
  const styles = reactCSS({
    'default': {
      box: {
        background: '#fff',
        borderRadius: 2,
        width: 390,
        padding: 30,
        boxShadow: '0 0 4px rgba(0,0,0,0.2), 0 8px 12px rgba(0,0,0,0.2)',
      },
      copy: {
        marginTop: 10,
        marginBottom: 10,
        borderLeft: '1px solid #ddd',
        paddingLeft: 20,
        paddingRight: 20,
        display: 'flex',
        alignItems: 'center',
        color: '#4990E2',
        cursor: 'pointer',
      },
      qrPopup: {
        background: '#fff',
        borderRadius: 2,
        width: 300,
        height: 300,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingBottom: 10,
      }
    },
  })
  const menu = new Menu()
  menu.append(new MenuItem({ label: 'Copy', role: 'copy' }))
  menu.append(new MenuItem({ label: 'Select All', role: 'selectall' }))
  const handleMenu = () => menu.popup(remote.getCurrentWindow())
	
  const handleCopied = () => closePopup(POPUP_NAME)

  const copyButton = (
    <div style={ styles.copy }>Copy</div>
  )

  return (
    <Popup name={ POPUP_NAME }>
      <div style={ styles.box } onContextMenu={ handleMenu }>
        <Head
          title="Payment Request"
          body="Send this encoded payment request to the party who would like to
                pay you via the Lightning Network."
        />
        <div style={ styles.qrPopup }>
            <QRCode.lightning paymentRequest={ paymentRequest } />
        </div>
        <Input
          fullWidth
          selectOnClick
          copyOnClick
          right={ copyButton }
          value={ paymentRequest }
          onCopy={ handleCopied }
        />
      </div>
    </Popup>
  )
}

export default PaymentRequestPopup
