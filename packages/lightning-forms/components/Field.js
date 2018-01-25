import React from 'react'
import reactCSS from 'reactcss'

export const Field = ({ name, type, placeholder, value, component, onChange,
  disabled, errorText, error, hide }) => {
  const styles = reactCSS({
    'default': {
      field: {
        display: 'flex',
      },
      error: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 20,
        fontSize: 14,
        color: 'rgba(213, 61, 80, 1)',
      },
    },
  })

  const handleChange = e =>
    (component ? onChange(e) : onChange({ [e.target.name]: e.target.value }))

  const Component = component || 'input'

  return (
    <div style={ styles.field }>
      {!hide && (
        <Component
          style={ styles.field }
          name={ name }
          type={ type }
          placeholder={ placeholder }
          value={ value }
          disabled={ disabled }
          onChange={ handleChange }
          outlineColor={ error && 'rgba(213, 61, 80, 0.3)' }
        />
      )}
      { errorText ? <div style={ styles.error }>{ errorText }</div> : null }
    </div>
  )
}

Field.defaultProps = {
  type: 'text',
  value: '',
}

Field.propTypes = {
  name: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  value: React.PropTypes.string,
  // component: React.PropTypes.element,
  // required: React.PropTypes.bool,
  // requiredMessage: React.PropTypes.string,
  // validate: React.PropTypes.func,
}

export default Field
