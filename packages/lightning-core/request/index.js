
import React from 'react'
import { Form } from 'lightning-forms'
import { actions as popupActions } from 'lightning-popup'
import { store } from 'lightning-store'
import { connect } from 'react-redux'
import { actions as paymentActions } from '../reducers/payment'
import { CurrencyInput, Head, Input, Page } from '../common'
import PaymentRequestPopup, { POPUP_NAME } from './PaymentRequestPopup'

export const Pay = ({ showPopup, closePopup, changePR, paymentRequest }) => {
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
    // eslint-disable-next-line
    const payment_request = 'lightning://7edb32d4ff3d7a385bfsd7637edb32d4ff3d7a385bfsd763'
    changePR(payment_request)
    showPopup(POPUP_NAME)
    console.log('success', amount, note)
    clear()
  }

  const handleError = (errors) => {
    console.log('error', errors)
  }

  return (
    <Page>
      <PaymentRequestPopup
        paymentRequest={ paymentRequest }
        closePopup={ closePopup }
      />

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
  state => ({
    paymentRequest: store.getGeneratedPaymentRequest(state),
  }), {
    showPopup: popupActions.onOpen,
    closePopup: popupActions.onClose,
    changePR: paymentActions.changeGeneratedPaymentRequest,
  }
)(Pay)
