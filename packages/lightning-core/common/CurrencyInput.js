import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'

import { Select } from 'lightning-components'
import Input from './Input'
import { enforceNumbers, getAll } from '../helpers/currencies'

export const CurrencyInput = (props) => {
  const styles = reactCSS({
    'default': {
      changer: {
        marginTop: 10,
        marginBottom: 10,
        borderLeft: '1px solid #ddd',
        paddingLeft: 10,
        paddingRight: 12,
        display: 'flex',
        alignItems: 'center',
        color: '#999',
      },
    },
  })

  const currencies = _.map(getAll(), (label, value) => ({ value, label }))
  const handleChange = () => {}

  const changer = (
    <div style={ styles.changer }>
      <Select
        bare
        options={ currencies }
        active="sat"
        onChange={ handleChange }
      />
    </div>
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
