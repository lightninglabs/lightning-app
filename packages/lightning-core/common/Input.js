import React from 'react'
import reactCSS from 'reactcss'

export class Input extends React.Component {
  state = {
    focused: false,
  }

  handleFocus = () => this.setState({ focused: true })
  handleBlur = () => this.setState({ focused: false })
  handleClick = () => {
    const { selectOnClick, copyOnClick, onCopy, onClick } = this.props
    if (copyOnClick) {
      this.input.select()

      try {
        const wasCopied = document.execCommand('copy')
        wasCopied && onCopy && onCopy()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error Copying to Clipboard:', error)
      }
    }
    selectOnClick && this.input.select()
    onClick && onClick()
  }

  render() {
    const { name, right, left, type, placeholder, value, sanitizeReturn,
      onChange, outlineColor, fullWidth } = this.props
    const styles = reactCSS({
      'default': {
        bg: {
          backgroundColor: '#fff',
          boxShadow: `0 0 2px ${ outlineColor }, 0 2px 4px ${ outlineColor }`,
          borderRadius: 2,
          height: 54,
          display: 'flex',
          alignItems: 'stretch',
          maxWidth: fullWidth ? null : 350,
          fontSize: 16,
          flex: 1,

          transition: 'box-shadow 100ms ease-out',
        },
        input: {
          background: 'none',
          flex: 1,
          border: 'none',
          outline: 'none',
          fontSize: 16,
          paddingLeft: 20,
          color: '#333',
        },
      },
      'focused': {
        bg: {
          boxShadow: '0 0 2px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.2)',
        },
      },
    }, { focused: this.state.focused })

    const handleChange = ({ target }) => onChange({
      [target.name]: sanitizeReturn ? sanitizeReturn(target.value) : target.value,
    })

    return (
      <div style={ styles.bg } onClick={ this.handleClick }>
        { left || null }
        <input
          style={ styles.input }
          ref={ input => (this.input = input) }
          name={ name }
          type={ type }
          placeholder={ placeholder }
          value={ value }
          onChange={ handleChange }

          onFocus={ this.handleFocus }
          onBlur={ this.handleBlur }
        />
        { right || null }
      </div>
    )
  }
}

Input.defaultProps = {
  outlineColor: 'rgba(0, 0, 0, 0.12)',
}

export default Input
