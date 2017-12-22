import React from 'react'
import { format } from 'url'
import qrImage from 'qr-image'

export const QRCode = {
  bitcoin: ({ address }) => {
    const bitcoinURL = format({ protocol: 'bitcoin:', host: address })
    const svg = qrImage.svgObject(bitcoinURL, { type: 'svg' })

    return (
      <svg viewBox={ "0 0 " + svg.size + " " + svg.size } shapeRendering="crispEdges">
        <path d={ svg.path }/>
      </svg>
    )
  },
  lightning: ({ paymentRequest }) => {
    const svg = qrImage.svgObject(paymentRequest, { type: 'svg' })

    return (
      <svg viewBox={ "0 0 " + svg.size + " " + svg.size } shapeRendering="crispEdges">
        <path d={ svg.path }/>
      </svg>
    )
  }
}

export default QRCode
