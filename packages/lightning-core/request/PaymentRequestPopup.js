import React from 'react'
import reactCSS from 'reactcss'

import { Popup } from 'lightning-popup'
import { Head, Input } from '../common'

export const POPUP_NAME = 'paymentRequest'

export const PaymentRequestPopup = () => {
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
        color: '#59D9A4',
      },
    },
  })

  const copyButton = (
    <div style={ styles.copy }>Copy</div>
  )

  return (
    <Popup name={ POPUP_NAME }>
      <div style={ styles.box }>
        <Head
          title="Payment Request"
          body="Send this URI to others so they can pay you via
          the Lightning network."
        />
        <Input
          fullWidth
          right={ copyButton }
        />
      </div>
    </Popup>
  )
}

export default PaymentRequestPopup
