import React from 'react'
import reactCSS from 'reactcss'

import { Popup } from 'lightning-popup'


export const PaymentRequestPopup = () => {
  const styles = reactCSS({
    'default': {
      box: {
        background: '#fff',
        borderRadius: 2,
        width: 450,
        height: 210,
        boxShadow: '0 0 4px rgba(0,0,0,0.2), 0 8px 12px rgba(0,0,0,0.2)',
      },
    },
  })
  return (
    <Popup visible>
      <div style={ styles.box }>
        Popup
      </div>
    </Popup>
  )
}

export default PaymentRequestPopup
