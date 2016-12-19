import React from 'react'
import _ from 'lodash'

import WalletsListCompactItem from './WalletsListCompactItem'

export const WalletsListCompact = ({ wallets, currency, onSelect, selectedWallet }) => {
  return (
    <div>
      { _.map(wallets, (wallet, i) => {
        return (
          <WalletsListCompactItem
            { ...wallet }
            currency={ currency }
            index={ i }
            key={ i }
            onSelect={ onSelect }
            active={ selectedWallet === wallet.id }
          />
        )
      }) }
    </div>
  )
}

export default WalletsListCompact
