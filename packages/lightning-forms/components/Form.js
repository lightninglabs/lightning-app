/* eslint-disable react/forbid-prop-types */

import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { actions, selectors } from '../reducer'

import Field from './Field'

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
    const { submitLabel, clearLabel, fields, values, name,
      onError, onSuccess, editForm, clearForm } = this.props

    const styles = reactCSS({
      'default': {
        form: {

        },
      },
    })

    const handleSubmit = () => {
      // Validate
      onSuccess()
      // else
      onError()
    }

    const handleClear = () => clearForm(name)

    const handleFieldChange = change => editForm(name, change)

    return (
      <div style={ styles.form }>

        { _.map(fields, field => (
          <Field
            { ...field }
            key={ field.name }
            value={ values[field.name] || field.value }
            onChange={ handleFieldChange }
          />
        ))}

        <div style={ styles.controls }>
          <div style={ styles.submit } onClick={ handleSubmit }>
            { submitLabel }
          </div>
          <div style={ styles.clear } onClick={ handleClear }>
            { clearLabel }
          </div>
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
}

Form.propTypes = {
  name: React.PropTypes.string.isRequired,
  fields: React.PropTypes.array.isRequired,
  values: React.PropTypes.object.isRequired,
}

export default connect(
  (state, ownProps) => ({
    values: selectors.getForm(state.forms, ownProps.name),
  }),
  actions
)(Form)
