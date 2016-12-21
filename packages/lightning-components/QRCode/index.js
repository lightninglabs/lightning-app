import React from 'react'
import { format } from 'url'
import qrImage from 'qr-image'

export const QRCode = ({ address }) => {
  const bitcoinURL = format({ protocol: 'bitcoin:', host: address })
  const svg = qrImage.imageSync(bitcoinURL, { type: 'svg' })

  return <div dangerouslySetInnerHTML={{ __html: svg }} />
}

export default QRCode
