/* eslint-disable react/forbid-prop-types */

import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { actions, selectors } from '../reducer'

import Field from './Field'

const validate = fields => new Promise((resolve, reject) => {
  const errors = {}
  _.map(fields, (field) => {
    if (field.required && field.value === '') {
      errors[field.name] = { error: true, errorText: `${ field.name } should not be empty` }
    }
  })

  _.isEmpty(errors) ? resolve() : reject(errors)
})

class Form extends React.Component {
  componentDidMount() {
    const { name, fields, initForm } = this.props
    const data = _.reduce(fields, (all, field) => {
      // eslint-disable-next-line no-param-reassign
      all[field.name] = field.value || ''
      return all
    }, {})
    initForm(name, data)
  }

  render() {
    const { submitLabel, clearLabel, name, combinedFields, spacing,
      onError, onSuccess, editForm, clearForm, setFormErrors } = this.props

    const wasEdited = _.some(combinedFields, 'value')
    const canSubmit = _.every(combinedFields, field => field.required && field.value)

    const styles = reactCSS({
      'default': {
        field: {
          paddingBottom: spacing,
        },
        controls: {
          display: 'flex',
          alignItems: 'stretch',
          height: 54,
        },
        button: {
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 20,
          fontSize: 16,
        },
        submit: {
          backgroundColor: '#ddd',
          borderRadius: 2,
          color: '#fff',

          transition: 'background-color 200ms ease-out',
        },
        clear: {
          color: '#999',
          cursor: 'pointer',
        },
      },
      'canSubmit': {
        submit: {
          cursor: 'pointer',
          backgroundColor: '#59D9A4',
          boxShadow: '0 2px 4px rgba(89, 217, 164, 0.3)',
        },
      },
    }, { canSubmit })

    const handleSubmit = () => {
      validate(combinedFields)
        .then(() => {
          console.log('SUCCESS')
          onSuccess()
        })
        .catch((errors) => {
          setFormErrors(name, errors)
          console.log('ERROR', errors)
          onError()
        })
    }

    const handleClear = () => clearForm(name)

    const handleFieldChange = change => editForm(name, change)

    return (
      <div style={ styles.form }>

        { _.map(combinedFields, field => (
          <div key={ field.name } style={ styles.field }>
            <Field
              { ...field }
              onChange={ handleFieldChange }
            />
          </div>
        ))}

        <div style={ styles.controls }>
          <div style={{ ...styles.button, ...styles.submit }} onClick={ handleSubmit }>
            { submitLabel }
          </div>
          { wasEdited ? (
            <div style={{ ...styles.button, ...styles.clear }} onClick={ handleClear }>
              { clearLabel }
            </div>
          ) : null }
        </div>
      </div>
    )
  }
}

Form.defaultProps = {
  submitLabel: 'Submit',
  clearLabel: 'Clear',
  onSuccess: () => {},
  onError: () => {},
  spacing: 20,
}

Form.propTypes = {
  name: React.PropTypes.string.isRequired,
  fields: React.PropTypes.array.isRequired,
}

export default connect(
  (state, ownProps) => {
    const values = selectors.getFormFields(state.forms, ownProps.name)
    const errors = selectors.getFormErrors(state.forms, ownProps.name)
    return {
      combinedFields: _.map(ownProps.fields, (field) => {
        return { ...field, ...errors[field.name], value: values[field.name] }
      }),
    }
  },
  actions
)(Form)
