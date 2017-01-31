import React from 'react'
import reactCSS from 'reactcss'

import Input from './Input'
import { enforceNumbers } from '../helpers/currencies'

export const CurrencyInput = (props) => {
  const styles = reactCSS({
    'default': {
      changer: {
        marginTop: 10,
        marginBottom: 10,
        borderLeft: '1px solid #ddd',
        paddingLeft: 20,
        paddingRight: 20,
        display: 'flex',
        alignItems: 'center',
        color: '#999',
      },
    },
  })

  const changer = (
    <div style={ styles.changer }>SAT</div>
  )

  return (
    <Input
      { ...props }
      right={ changer }
      sanitizeReturn={ enforceNumbers }
    />
  )
}

export default CurrencyInput
