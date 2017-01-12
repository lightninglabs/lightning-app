import React from 'react'

import { Box } from 'lightning-components'
import WalletsList from './wallet/WalletsList'
import { Header } from './common'

export const Wallet = ({ currency, activeWallet, wallets,
  switchWallet, account }) => (
    <div style={{ flex: 1 }}>
      <Header title="Wallets" />

      <Box paddingTop="medium">
        <WalletsList
          account={ account }
          activeWallet={ activeWallet }
          wallets={ wallets }
          currency={ currency }
          onWalletChange={ switchWallet }
        />
      </Box>
    </div>
)

export default Wallet
