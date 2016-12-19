import React from 'react'

import { Box } from 'lightning-components'
import WalletsList from './wallet/WalletsList'
import { Header, CurrencyChanger } from './common'

export const Wallet = ({ currency, changeCurrency, activeWallet, wallets,
  switchWallet, account }) => {
  const changer = (
    <CurrencyChanger
      currency={ currency }
      onChange={ changeCurrency }
    />
  )
  return (
    <div style={{ flex: 1 }}>
      <Header title="Wallets" right={ changer } />

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
}

export default Wallet
