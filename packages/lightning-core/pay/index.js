
import React from 'react'
import { Form } from 'lightning-forms'

export const Pay = () => {
  const fields = [
    {
      name: 'address',
      placeholder: 'Lightning URL / Bitcoin Address',
      required: true,
    },
    {
      name: 'amount',
      placeholder: 'Amount',
      required: true,
    },
  ]

  return (
    <Form
      name="pay"
      fields={ fields }
      submitLabel="Send Payment"
      clearLabel="Cancel"
    />
  )
}

export default Pay
