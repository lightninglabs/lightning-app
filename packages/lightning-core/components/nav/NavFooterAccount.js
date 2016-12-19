import React from 'react'
import { hover as h } from 'reactcss'
import { Link } from 'react-router'

import { SidebarItem } from 'lightning-components'

export const NavFooterAccount = ({ onClick, identity, hover }) => {
  return (
    <Link to={ '/wallets' } style={{ textDecoration: 'none' }}>
      <SidebarItem
        icon="account-circle"
        display="block"
        label={ identity }
        ellipsis
        hover={ hover }
        color="gray"
        hoverColor="lighter-gray"
      />
    </Link>
  )
}

export default h(NavFooterAccount)
