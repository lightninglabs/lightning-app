/* eslint-disable global-require, no-console */

import React from 'react'
import { connect } from 'react-redux'
import { Form, actions as formActions } from 'lightning-forms'
import { actions } from './reducer'
import { remote } from 'electron'
import { actions as accountsActions } from '../accounts'
import { CurrencyInput, Head, Input, Page } from '../common'
import { sanitizePaymentRequest } from '../helpers'

const { Menu, MenuItem } = remote

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
    {
      name: 'description',
      placeholder: 'Description',
      component: Input,
      hide: true,
      disabled: true,
    },
  ]
  // If current form is a payment request
  let requestActive = false

  const menu = new Menu()
  menu.append(new MenuItem({ label: 'Paste', role: 'paste' }))
  const handleMenu = () => menu.popup(remote.getCurrentWindow())

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

  // Clear all fields in form
  const clearForm = () => {
    onEditForm('pay', {
      address: '',
      amount: '',
      description: '',
    })
    fields[1].disabled = false
    fields[2].hide = true
  }

  // Handle change on payment form
  const handleChange = (change) => {
    if (requestActive === true) {
      clearForm()
      requestActive = false
    }
    if (change.address) {
      const paymentRequest = sanitizePaymentRequest(change.address)
      onDecodePaymentRequest({ paymentRequest })
        .then((decoded) => {
          requestActive = true
          const amount = decoded.num_satoshis
          const description = decoded.description
          // Disable the amount field when using payment requests
          fields[1].disabled = true
          if (description) { fields[2].hide = false }
          onEditForm('pay', { amount, description: decoded.description })
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
      <div onContextMenu={ handleMenu } >
        <Form
          name="pay"
          fields={ fields }
          submitLabel="Send Payment"
          clearLabel="Cancel"
          onChange={ handleChange }
          onSuccess={ handleSuccess }
          onError={ handleError }
        />
      </div>
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
