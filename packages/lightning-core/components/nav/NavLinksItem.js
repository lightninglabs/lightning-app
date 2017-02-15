import React from 'react'
import { hover as h } from 'reactcss'
import { Link, withRouter } from 'react-router-dom'

import { SidebarItem } from 'lightning-components'

export const NavLinksItem = ({ id, icon, label, hover, location }) => {
  return (
    <Link to={ `/${ id }` } style={{ textDecoration: 'none' }}>
      <SidebarItem
        icon={ icon }
        label={ label }
        active={ `/${ id }` === location.pathname }
        hover={ hover }
        color="gray"
        hoverColor="lighter-gray"
      />
    </Link>
  )
}

export default withRouter(h(NavLinksItem))
