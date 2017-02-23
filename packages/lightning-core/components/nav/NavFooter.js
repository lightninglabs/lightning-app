import React from 'react'

import { Box, Media, Text } from 'lightning-components'
import NavFooterAccount from './NavFooterAccount'
import { Money, MoneySign } from '../common'

import { total } from '../../helpers/wallet'

export const NavFooter = ({ pubkey, currency, balances, onClickAccount }) => {
  return (
    <div>
      <Box padding="small" fontSize="medium" color="gray">
        <Media
          paddingLeft="small"
          left={ <MoneySign currency={ currency } /> }
        >
          <Text color="off-white">
            <Money amount={ total(balances) } currency={ currency } />
          </Text>
        </Media>
      </Box>
      <NavFooterAccount
        identity={ pubkey }
        onClick={ onClickAccount }
      />
    </div>
  )
}

export default NavFooter
