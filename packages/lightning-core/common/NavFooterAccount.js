import React from 'react'
import { hover as h } from 'reactcss'
import { Link } from 'react-router-dom'

import { SidebarItem } from 'lightning-components'

export const NavFooterAccount = ({ identity, hover }) => {
  return (
    <Link to={ '/accounts' } style={{ textDecoration: 'none' }}>
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
