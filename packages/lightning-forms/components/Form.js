import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'

class Form extends React.Component {
  compnentDidMount() {
    const { name, fields, initForm } = this.props
    initForm(name, _.reduce(fields, (all, field) => {
      // eslint-disable-next-line no-param-reassign
      all[field.name] = field.value || ''
      return all
    }, {}))
  }

  render() {
    const styles = reactCSS({
      'default': {

      },
    })

    return (
      <div>
        form
      </div>
    )
  }
}

export default Form
