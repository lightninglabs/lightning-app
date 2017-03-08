import React from 'react'
import reactCSS from 'reactcss'

import { Head, Page } from '../common'

export const CreateChannelPage = () => {
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

  return (
    <Page>
      <Head
        title="Create Channel"
        body="Channels are like tubes of money used to transfer funds within
        the network"
      />

    </Page>
  )
}

export default CreateChannelPage
