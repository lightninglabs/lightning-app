/* eslint-disable react/jsx-no-bind */

import React from 'react'

import { Box, Input, LiftedInput, LinkWithIcon, Text } from 'lightning-components'
import { LiftedCurrencyInput } from './common'

export const PaymentBitcoin = ({ form, changeBitcoinForm, sendCoins,
  address, currency, isSynced, onError }) => {
  const canSend = form.to && form.amount > 0
  const handleChange = (key, e) => changeBitcoinForm({ [key]: e.target.value })
  const emptyGuard = () => (canSend ? sendCoins(form) : onError('Input Payment Address and Amount'))
  const handleSend = () => (isSynced ? (
    emptyGuard()
  ) :
    onError('Wait Until Synced to Send Bitcoin')
  )

  return (
    <Box direction="column" flex={ 1 }>
      <Box direction="column" align="center" verticalAlign="center" flex={ 1 }>
        <LiftedInput
          value={ form.to }
          placeholder="Payment Address"
          style={{ width: 212 }}
          onChange={ handleChange.bind(null, 'to') }
        />
        <Box paddingTop="medium" />
        <LiftedCurrencyInput
          value={ form.amount }
          currency={ currency }
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
          onClick={ handleSend }
          label="Send Bitcoin"
          icon="coins"
          paddingBottom="none"
          color={ isSynced && canSend ? 'teal' : 'light-gray' }
        />
      </Box>
      <Box
        direction="row"
        verticalAlign="center"
        align="center"
        padding="medium"
        paddingTop="small"
        paddingBottom="small"
        style={{ borderTop: '1px solid #eee' }}
      >
        <Text size="large" color="light-gray" paddingLeft="small" paddingRight="small">Recieve Bitcoin:</Text>
        <Input fontSize="large" value={ address } style={{ flex: 1 }} readOnly />
      </Box>

    </Box>
  )
}

export default PaymentBitcoin
