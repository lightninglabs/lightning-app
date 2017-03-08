import React from 'react'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { Form } from 'lightning-forms'
import { actions } from './reducer'

import { CurrencyInput, Head, Input, Page } from '../common'

export const CreateChannelPage = ({ createChannel }) => {
  const fields = [
    {
      name: 'ip',
      placeholder: 'Host / IP',
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

  const styles = reactCSS({
    default: {
      page: {
        display: 'flex',
        flexDirection: 'column',
      },
      link: {
        fontSize: 12,
        textTransform: 'uppercase',
        textDecoration: 'none',
        color: '#4990E2',
      },
    },
  })

  const handleSuccess = ({ ip, amount }, clear) => {
    createChannel({ ip, amount })
      .then(clear)
  }

  return (
    <Page>
      <Head
        title="Create Channel"
        body="Channels are like tubes of money used to transfer funds within
        the network"
      />
      <Form
        name="create-channel"
        fields={ fields }
        submitLabel="Create Channel"
        clearLabel="Cancel"
        onSuccess={ handleSuccess }
      />
    </Page>
  )
}

export default connect(
  () => ({}), {
    createChannel: actions.createChannel,
  }
)(CreateChannelPage)
