/* eslint-disable react/jsx-no-bind */

import React from 'react'

import { Box, LiftedInput, LinkWithIcon } from 'lightning-components'
import { LiftedCurrencyInput } from './common'
import PaymentLightningSend from './payment/PaymentLightningSend.js'

export const PaymentLightning = ({ form, changeLightningForm, requestLightning,
  sendURI, changeSendURI, currency, account, sendLightningForm, makePayment,
  isSynced, onError }) => {
  const handleChange = (key, e) => changeLightningForm({ [key]: e.target.value })
  const handleRequest = () => (form.amount > 0 ?
    requestLightning(form, account.pubKey) :
    onError('Input Request Amount')
  )


  const handleSend = () => (isSynced ? makePayment(
    sendLightningForm.amount,
    sendLightningForm.pubkey,
    sendLightningForm.rHash,
  ) : (
    onError('Wait Until Synced to Send Lightning')
  ))

  return (
    <Box direction="column" flex={ 1 }>
      <Box direction="column" align="center" verticalAlign="center" flex={ 1 }>
        <LiftedCurrencyInput
          currency={ currency }
          value={ form.amount }
          placeholder="0.0000"
          style={{ width: 100 }}
          onChange={ handleChange.bind(null, 'amount') }
        />
        <Box paddingTop="medium" />
        <LiftedInput
          placeholder="Note"
          value={ form.note }
          style={{ width: 212 }}
          onChange={ handleChange.bind(null, 'note') }
        />
        <LinkWithIcon
          onClick={ handleRequest }
          label="Request via Lightning"
          icon="flash"
          color={ form.amount > 0 ? 'teal' : 'light-gray' }
          paddingBottom="none"
        />
        { form.uri ? (
          <Box
            style={{
              paddingLeft: 'large',
              paddingRight: 'large',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <Box paddingTop="large" />
            <LiftedInput
              readOnly
              placeholder="URI"
              value={ form.uri }
              style={{ width: '100%' }}
            />
          </Box>
        ) : null }
      </Box>
      <PaymentLightningSend
        sendURI={ sendURI }
        onChange={ changeSendURI }
        onSend={ handleSend }
        currency={ currency }
        isSynced={ isSynced }
        form={ sendLightningForm }
      />
    </Box>
  )
}

export default PaymentLightning
