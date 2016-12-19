import React from 'react'

import { Box, Input } from '../'

export class LiftedInput extends React.Component {
  state = {
    focused: false,
  }

  handleFocus = () => this.setState({ focused: true })
  handleBlur = () => this.setState({ focused: false })

  render() {
    return (
      <Box
        zDepth={ this.state.focused ? 11 : 1 }
        display="inline-block"
        background="white"
        width={ this.props.style && this.props.style.width }
        style={{ borderRadius: 2 }}
        { ...this.props.style }
      >
        <Input
          { ...this.props }
          onFocus={ this.handleFocus }
          onBlur={ this.handleBlur }
        />
      </Box>
    )
  }
}

export default LiftedInput
