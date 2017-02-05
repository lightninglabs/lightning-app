
import React from 'react'
import { Form } from 'lightning-forms'
import { actions as popupActions } from 'lightning-popup'
import { connect } from 'react-redux'
import { CurrencyInput, Head, Input, Page } from '../common'
import PaymentRequestPopup, { POPUP_NAME } from './PaymentRequestPopup'

export const Pay = ({ showPopup }) => {
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
    showPopup(POPUP_NAME)
    console.log('success', amount, note)
    clear()
  }

  const handleError = (errors) => {
    console.log('error', errors)
  }

  return (
    <Page>
      <PaymentRequestPopup name={ POPUP_NAME } />

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

export default connect(
  () => ({}), {
    showPopup: popupActions.onOpen,
  }
)(Pay)
