import React from 'react'
import reactCSS from 'reactcss'
import _ from 'lodash'

import WalletsListItem from './WalletsListItem'

export const WalletsList = ({ wallets, activeWallet, currency, onWalletChange,
  account }) => {
  const styles = reactCSS({
    'default': {
      wallets: {
        borderTop: '1px solid #eee',
      },
      wallet: {
        borderBottom: '1px solid #eee',
      },
    },
  })

  return (
    <div style={ styles.wallets }>
      { _.map(wallets, (wallet, i) => {
        return (
          <div style={ styles.wallet } key={ i }>
            <WalletsListItem
              { ...wallet }
              account={ account }
              active={ activeWallet === i }
              currency={ currency }
              index={ i }
              onWalletChange={ onWalletChange }
            />
          </div>
        )
      }) }
    </div>
  )
}

export default WalletsList
