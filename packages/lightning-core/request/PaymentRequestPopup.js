import React from 'react'
import reactCSS from 'reactcss'

import { Popup } from 'lightning-popup'
import { Head, Input } from '../common'

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
    },
  })

  const handleCopied = () => closePopup(POPUP_NAME)

  const copyButton = (
    <div style={ styles.copy }>Copy</div>
  )

  return (
    <Popup name={ POPUP_NAME }>
      <div style={ styles.box }>
        <Head
          title="Payment Request"
          body="Send this encoded payment request to the party who would like to
                pay you via the Lightning Network."
        />
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
