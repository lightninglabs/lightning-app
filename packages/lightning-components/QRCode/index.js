import React from 'react'
import { format } from 'url'
import qrImage from 'qr-image'

export const QRCode = {
  bitcoin: ({ address }) => {
    const bitcoinURL = format({ protocol: 'bitcoin:', host: address })
    const svg = qrImage.imageSync(bitcoinURL, { type: 'svg' })

    // eslint-disable-next-line react/no-danger
    return <div dangerouslySetInnerHTML={{ __html: svg }} />
  },
  lightning: ({ paymentRequest }) => {
    console.log(paymentRequest);
    const svg = qrImage.imageSync(paymentRequest, { type: 'svg' })

    // eslint-disable-next-line react/no-danger
    return <div dangerouslySetInnerHTML={{ __html: svg }} />
  }
}

export default QRCode
