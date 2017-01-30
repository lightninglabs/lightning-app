
import React from 'react'
import { Form } from 'lightning-forms'

export const Pay = () => {
  const fields = [
    {
      name: 'address',
      placeholder: 'Lightning URL / Bitcoin Address',
    },
    {
      name: 'amount',
      placeholder: 'Amount',
    },
  ]

  return (
    <Form
      name="pay"
      fields={ fields }
      values={{}}
      submitLabel="Send Payment"
      clearLabel="Cancel"
    />
  )
}

export default Pay
