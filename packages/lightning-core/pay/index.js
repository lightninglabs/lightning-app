
import React from 'react'
import { Form } from 'lightning-forms'
import { CurrencyInput, Head, Input, Page } from '../common'

export const Pay = () => {
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
    console.log('success', address, amount)
    clear()
  }

  const handleError = (errors) => {
    console.log('error', errors)
  }

  return (
    <Page>
      <Head
        title="Make a Payment"
        body="Lightning payments will be instant, while on-chain Bitcoin
        transactions will require blockchain confirmation (approx. 10 mins)"
      />
      <Form
        name="pay"
        fields={ fields }
        submitLabel="Send Payment"
        clearLabel="Cancel"
        onSuccess={ handleSuccess }
        onError={ handleError }
      />
    </Page>
  )
}

export default Pay

export { default as reducer, actions, selectors } from './reducer'
