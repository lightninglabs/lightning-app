import React from 'react'

import { Head, Page } from '../common'
import Wallet from './Wallet'
import ChannelList from './ChannelList'

const channels = [
  {
    remotePubkey: 'af828g32gh7a5g72ds45fg24sa35gra',
    id: '0dfg86z5f3g546s3f5r78ga76gs75d6',
    capacity: 40000,
    localBalance: 10000,
    remoteBalance: 30000,
    status: 'active',
  }, {
    remotePubkey: 'gra0dfg86z5f3g546s3f5r78ga76afas',
    id: '72ds45fg24sa35gs75d6af828g32gh7a5g',
    capacity: 20000,
    localBalance: 17000,
    remoteBalance: 3000,
    status: 'pending',
  },
]

export const Accounts = () => {
  return (
    <div>
      <Wallet />
      <Page>
        <Head
          title="Your Channels"
          body="Channels are like lines of credit you have open with other
          people on the network."
        />
        <ChannelList channels={ channels } />
      </Page>
    </div>
  )
}

export default Accounts
