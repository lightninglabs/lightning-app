import React from 'react'

import { Redirect, Match } from 'react-router-dom'
import { Box } from 'lightning-components'
import PaymentRequestTabs from './payment/PaymentRequestTabs'

import PaymentLightningContainer from '../containers/PaymentLightningContainer'
import PaymentBitcoinContainer from '../containers/PaymentBitcoinContainer'

export const Payment = ({ makePayment }) => (
  <Box direction="column" flex={ 1 }>
    <PaymentRequestTabs />

    <Redirect to="/payment/lightning" />
    <Match
      pattern="/payment/lightning"
      render={ () => <PaymentLightningContainer makePayment={ makePayment } /> }
    />
    <Match
      pattern="/payment/bitcoin"
      component={ PaymentBitcoinContainer }
    />
  </Box>
)

export default Payment
