import React from 'react'
import { storiesOf } from '@kadira/storybook'

import WalletsList from './WalletsList'
import WalletsListItem from './WalletsListItem'

const wallets = [
  {
    id: 0,
    identity: 'case@casesandberg.com',
    amount: {
      total: 8.541222,
      blockchain: 1.51102,
      channels: 7.030202,
    },
  }, {
    id: 1,
    identity: 'safe@casesandberg.com',
    amount: {
      total: 324.1000345,
      blockchain: 324.1000345,
      channels: 0,
    },
  },
]

const currency = 'btc'

storiesOf('WalletsList', module)
  .add('wallets active: 0', () => (
    <WalletsList
      activeWallet={ 0 }
      wallets={ wallets }
      currency={ currency }
    />
  ))
  .add('wallets active: 1', () => (
    <WalletsList
      activeWallet={ 1 }
      wallets={ wallets }
      currency={ currency }
    />
  ))

storiesOf('WalletsListItem', module)
  .add('wallet', () => (
    <WalletsListItem { ...wallets[0] } currency={ currency } />
  ))
  .add('wallet `active`', () => (
    <WalletsListItem { ...wallets[0] } active currency={ currency } />
  ))
