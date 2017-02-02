
import React from 'react'
import { Form } from 'lightning-forms'
import { CurrencyInput, Head, Input, Page } from '../common'
import PaymentRequestPopup from './PaymentRequestPopup'

export const Pay = () => {
  const fields = [
    {
      name: 'amount',
      placeholder: 'Amount',
      required: true,
      component: CurrencyInput,
    },
    {
      name: 'note',
      placeholder: 'Note',
      component: Input,
    },
  ]

  const handleSuccess = ({ amount, note }, clear) => {
    console.log('success', amount, note)
    clear()
  }

  const handleError = (errors) => {
    console.log('error', errors)
  }

  return (
    <Page>
      <PaymentRequestPopup />

      <Head
        title="Request Lightning Payment"
        body="Generate a payment request for someone to pay you
        immidiately via the lightning network."
      />
      <Form
        name="request"
        fields={ fields }
        submitLabel="Generate Payment Request"
        clearLabel="Cancel"
        onSuccess={ handleSuccess }
        onError={ handleError }
      />
    </Page>
  )
}

export default Pay
