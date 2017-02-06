import React from 'react'
import reactCSS from 'reactcss'

import { Icon } from 'lightning-components'
import { Input } from '../common'

export const BitcoinWallet = ({ address }) => {
  const styles = reactCSS({
    'default': {
      wrap: {
        borderTop: '1px solid #ddd',
        padding: 20,
        display: 'flex',
        alignItems: 'center',
      },
      label: {
        marginTop: 10,
        marginBottom: 10,
        borderRight: '1px solid #ddd',
        paddingLeft: 20,
        paddingRight: 20,
        display: 'flex',
        alignItems: 'center',
        color: '#999',
      },
      icon: {
        paddingLeft: 20,
        cursor: 'pointer',
        color: '#666',
      },
    },
  })

  const label = (
    <div style={ styles.label }>Wallet Address</div>
  )

  return (
    <div style={ styles.wrap }>
      <Input
        fullWidth
        selectOnClick
        copyOnClick
        left={ label }
        value={ address }
      />
      <div style={ styles.icon }>
        <Icon name="qrcode" />
      </div>
    </div>
  )
}

export default BitcoinWallet
