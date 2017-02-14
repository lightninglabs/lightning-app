import React from 'react'

import { Box, Text, LiftedInput } from 'lightning-components'
import { Link } from 'react-router-dom'
import { Header, LiftedCurrencyInput } from './common'

export const ChannelsCreate = ({ fillCreateForm, host, amount, createChannel,
  navigateToChannels, currency, isSynced, onError }) => {
  const handleHostChange = e => fillCreateForm({ host: e.target.value, amount })
  const handleAmountChange = e => fillCreateForm({ host, amount: e.target.value })
  const handleCreate = () => (isSynced ? createChannel({ host, amount }) :
    onError('Wait Until Synced to Create a Channel'))

  return (
    <div>
      <Header title="Create New Channel" />

      <Box padding="large" top="medium" direction="column" verticalAlign="top">
        <LiftedInput
          style={{ width: 320 }}
          value={ host }
          placeholder="Host / IP"
          onChange={ handleHostChange }
        />
        <Box paddingTop="medium" />
        <LiftedCurrencyInput
          currency={ currency }
          style={{ width: 140 }}
          value={ amount }
          placeholder="0.0000"
          onChange={ handleAmountChange }
        />
        <Box paddingTop="large" direction="row">
          <Text
            size="large"
            color={ isSynced ? 'blue' : 'light-gray' }
            onClick={ handleCreate }
            paddingRight="large"
          >
            Create
          </Text>
          <Link to="/channels" style={{ textDecoration: 'none' }}>
            <Text
              size="large"
              color="light-gray"
              onClick={ navigateToChannels }
            >
              Cancel
            </Text>
          </Link>
        </Box>
      </Box>
    </div>
  )
}

export default ChannelsCreate
