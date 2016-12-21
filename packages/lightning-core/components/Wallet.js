import React from 'react'

import { Box } from 'lightning-components'
import WalletsList from './wallet/WalletsList'
import { Header } from './common'
// import { Header, CurrencyChanger } from './common'

// export const Wallet = ({ currency, changeCurrency, activeWallet, wallets,
export const Wallet = ({ currency, activeWallet, wallets,
  switchWallet, account }) => {
  // const changer = (
  //   <CurrencyChanger
  //     currency={ currency }
  //     onChange={ changeCurrency }
  //   />
  // )
  // right={ changer }
  return (
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
}

export default Wallet
