import React from 'react'
import reactCSS from 'reactcss'

import { Popup } from 'lightning-popup'
import { Icon, QRCode } from 'lightning-components'
import { Input } from '../common'

const QR_CODE = 'QR_CODE'

export class BitcoinWallet extends React.Component {
  componentDidMount() { this.props.onFetchAddress() }

  render() {
    const { address, onSuccess, onShowQR } = this.props

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
        qrPopup: {
          background: '#fff',
          borderRadius: 2,
          width: 300,
          height: 300,
        },
      },
    })

    const handleCopy = () => onSuccess('Copied to Clipboard')
    const handleClick = () => onShowQR(QR_CODE)

    const label = (
      <div style={ styles.label }>Wallet Address</div>
    )

    return (
      <div style={ styles.wrap }>

        <Popup name={ QR_CODE }>
          <div style={ styles.qrPopup }>
            <QRCode address={ address } />
          </div>
        </Popup>

        <Input
          fullWidth
          selectOnClick
          copyOnClick
          onCopy={ handleCopy }
          left={ label }
          value={ address }
        />
        <div style={ styles.icon }>
          <Icon name="qrcode" onClick={ handleClick } />
        </div>
      </div>
    )
  }
}

export default BitcoinWallet
