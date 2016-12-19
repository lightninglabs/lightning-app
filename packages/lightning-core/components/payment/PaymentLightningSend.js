import React from 'react'

import { Box, LiftedInput, Text } from 'lightning-components'
import { LiftedCurrencyInput } from '../common'

export const PaymentLIghtningSend = ({ sendURI, onChange, onSend, currency, form,
  isSynced }) => {
  const handleSendURI = e => onChange(e.target.value)
  const handleSend = () => onSend(sendURI)
  const trayOpen = form.amount && form.pubkey

  return (
    <Box
      direction="row"
      verticalAlign="center"
      align="center"
      padding="medium"
      background="dark-teal"
      style={{ flexWrap: 'wrap' }}
    >
      { trayOpen ? null : (
        <Text
          size="large"
          color="black"
          style={{ opacity: 0.47 }}
          paddingLeft="small"
          paddingRight="medium"
        >Send:</Text>
      ) }
      <Box flex={ 1 } direction="column">
        <LiftedInput
          fontSize="large"
          value={ sendURI }
          onChange={ handleSendURI }
          placeholder="Lightning URI"
          style={{ flex: 1, display: 'flex', opacity: trayOpen ? 0.5 : 1 }}
        />
        { trayOpen ? (
          <Box paddingTop="medium" direction="row" verticalAlign="center" style={{ height: 54 }}>
            <LiftedCurrencyInput
              readOnly
              currency={ currency }
              value={ form.amount }
              style={{ width: 130 }}
            />
            <Box paddingLeft="medium" />
            <LiftedInput
              readOnly
              value={ form.pubkey }
              style={{ flex: 1, display: 'flex' }}
            />
            <Box paddingLeft="medium" />
            <Text
              size="large"
              color={ isSynced ? 'white' : 'gray' }
              style={{ lineHeight: 54 }}
              onClick={ handleSend }
            >Send</Text>
          </Box>
        ) : null }
      </Box>
    </Box>
  )
}

export default PaymentLIghtningSend
