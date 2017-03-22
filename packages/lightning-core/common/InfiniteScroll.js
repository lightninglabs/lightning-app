import React from 'react'
import reactCSS from 'reactcss'

import Infinite from 'react-infinite'

export class InfiniteScroll extends React.Component {
  state = {
    height: 300,
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ height: this.outside.offsetHeight - 30 })
  }

  componentWillReceiveProps() {
    this.setState({ height: this.outside.offsetHeight - 30 })
  }

  render() {
    const { children, startAtBottom, insideStyles, elementHeight } = this.props

    const styles = reactCSS({
      default: {
        wrap: {
          flex: 1,
        },
      },
    })

    return (
      <div style={ styles.wrap } ref={ wrap => (this.outside = wrap) }>
        <Infinite
          containerHeight={ this.state.height }
          elementHeight={ elementHeight }
          styles={{
            scrollableStyle: insideStyles,
          }}
          displayBottomUpwards={ startAtBottom }
        >
          { children }
        </Infinite>
      </div>
    )
  }
}

InfiniteScroll.defaultProps = {
  startAtBottom: false,
  insideStyles: {},
  elementHeight: 15,
}
