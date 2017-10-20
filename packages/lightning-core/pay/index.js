/* eslint-disable global-require, no-console */

import React from 'react'
import { connect } from 'react-redux'
import { Form, actions as formActions } from 'lightning-forms'
import { actions } from './reducer'
import { actions as accountsActions } from '../accounts'
import { CurrencyInput, Head, Input, Page } from '../common'
import { sanitizePaymentRequest } from '../helpers'

export const Pay = ({ onMakePayment, onDecodePaymentRequest, onEditForm,
  onFetchAccount, onFetchChannels }) => {
  const fields = [
    {
      name: 'address',
      placeholder: 'Payment Request / Bitcoin Address',
      required: true,
      component: Input,
    },
    {
      name: 'amount',
      placeholder: 'Amount',
      required: true,
      component: CurrencyInput,
    },
  ]

  const handleSuccess = ({ address, amount }, clear) => {
    onMakePayment({ address, amount })
      .then(() => {
        onFetchAccount()
        onFetchChannels()
        clear()
      })
      .catch(console.error)
  }

  const handleError = (errors) => {
    console.log('error', errors)
  }

  const handleChange = (change) => {
    if (change.address) {
      const paymentRequest = sanitizePaymentRequest(change.address)
      onDecodePaymentRequest({ paymentRequest })
        .then((decoded) => {
          const amount = decoded.num_satoshis
          onEditForm('pay', { amount })
        })
        .catch(console.error)
    }
  }

  return (
    <Page>
      <Head
        title="Make a Payment"
        body="Lightning payments will be instant, while on-chain Bitcoin
              transactions require at least one confirmation (approx. 10 mins)"
      />
      <Form
        name="pay"
        fields={ fields }
        submitLabel="Send Payment"
        clearLabel="Cancel"
        onChange={ handleChange }
        onSuccess={ handleSuccess }
        onError={ handleError }
      />
    </Page>
  )
}

export default connect(
  () => ({}), {
    onMakePayment: actions.makePayment,
    onDecodePaymentRequest: actions.decodePaymentRequest,
    onEditForm: formActions.editForm,
    onFetchAccount: accountsActions.fetchAccount,
    onFetchChannels: accountsActions.fetchChannels,
  },
)(Pay)

export { default as reducer, actions, selectors } from './reducer'
