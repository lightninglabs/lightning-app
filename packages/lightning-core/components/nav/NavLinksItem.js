import React from 'react'
import { hover as h } from 'reactcss'
import { Link } from 'react-router'

import { SidebarItem } from 'lightning-components'

export const NavLinksItem = ({ id, icon, label, active, hover }) => {
  return (
    <Link to={ `/${ id }` } style={{ textDecoration: 'none' }}>
      <SidebarItem
        icon={ icon }
        label={ label }
        active={ active }
        hover={ hover }
        color="gray"
        hoverColor="lighter-gray"
      />
    </Link>
  )
}

export default h(NavLinksItem)
