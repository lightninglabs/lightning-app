import React from 'react'
import reactCSS from 'reactcss'

export const Input = ({ name, right, type, placeholder, value, sanitizeReturn,
  onChange }) => {
  const styles = reactCSS({
    'default': {
      bg: {
        backgroundColor: '#fff',
        boxShadow: '0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.12)',
        height: 54,
        display: 'flex',
        alignItems: 'stretch',
        maxWidth: 350,
        fontSize: 16,
      },
      input: {
        flex: 1,
        border: 'none',
        outline: 'none',
        fontSize: 16,
        paddingLeft: 20,
        color: '#333',
      },
    },
  })

  const handleChange = ({ target }) => onChange({
    [target.name]: sanitizeReturn ? sanitizeReturn(target.value) : target.value,
  })

  return (
    <div style={ styles.bg }>
      <input
        style={ styles.input }
        name={ name }
        type={ type }
        placeholder={ placeholder }
        value={ value }
        onChange={ handleChange }
      />
      { right || null }
    </div>
  )
}

export default Input
