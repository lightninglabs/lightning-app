import React from 'react'

import { Box, Media, Text } from 'lightning-components'
import NavFooterAccount from './NavFooterAccount'
import { Money, MoneySign } from '../common'

import { total } from '../../helpers/wallet'

export const NavFooter = ({ currency, amount = {}, identity, onClickAccount, account = {} }) => {
  return (
    <div>
      <Box padding="small" fontSize="medium" color="gray">
        <Media
          paddingLeft="small"
          left={ <MoneySign currency={ currency } /> }
        >
          <Text color="off-white">
            <Money amount={ total(amount) } currency={ currency } />
          </Text>
        </Media>
      </Box>
      <NavFooterAccount
        identity={ identity || account.pubKey }
        onClick={ onClickAccount }
      />
    </div>
  )
}

export default NavFooter
