import React from 'react'
import { connect } from 'react-redux'
import { actions as accountActions } from '../accounts'

export class Streams extends React.Component {
  componentDidMount() {
    this.interval = setInterval(this.props.onFetchAccount, 20000)
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  render() {
    return null
  }
}

export default connect(
  () => ({}), {
    onFetchAccount: accountActions.fetchAccount,
  }
)(Streams)
