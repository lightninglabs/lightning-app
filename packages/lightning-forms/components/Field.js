import React from 'react'
import reactCSS from 'reactcss'

export const Field = ({ name, type, placeholder, value, component, onChange,
  errorText }) => {
  const styles = reactCSS({
    'default': {
      field: {

      },
    },
  })

  const handleChange = e => onChange({ [e.target.name]: e.target.value })

  const Component = component || 'input'

  return (
    <div>
      <Component
        style={ styles.field }
        name={ name }
        type={ type }
        placeholder={ placeholder }
        value={ value }
        onChange={ handleChange }
      />
      { errorText ? <div>{ errorText }</div> : null }
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
  component: React.PropTypes.element,
  // required: React.PropTypes.bool,
  // requiredMessage: React.PropTypes.string,
  // validate: React.PropTypes.func,
}

export default Field
