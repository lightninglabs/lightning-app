import React from 'react'
import _ from 'lodash'

import NavLinksItem from './NavLinksItem'

export const NavLinks = ({ active, onChange }) => {
  const links = [
    {
      icon: 'coin',
      label: 'Pay',
      id: 'pay',
    },
    {
      icon: 'coin',
      label: 'Request',
      id: 'request',
    },
    {
      icon: 'coin',
      label: 'Send / Request',
      id: 'payment',
    },
    {
      icon: 'wallet',
      label: 'Your Wallets',
      id: 'wallets',
    },
    {
      icon: 'swap-horizontal',
      label: 'Transactions',
      id: 'transactions',
    },
    {
      icon: 'chart-bubble',
      label: 'Channels',
      id: 'channels',
    },
  ]

  return (
    <div>
      { _.map(links, link => (
        <NavLinksItem
          key={ link.id }
          { ...link }
          active={ link.id === active }
          onClick={ onChange }
        />
      )) }
    </div>
  )
}

export default NavLinks
