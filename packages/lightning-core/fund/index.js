import React from 'react'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { QRCode } from 'lightning-components'
import { actions } from './reducer'
import { actions as notificationActions } from 'lightning-notifications'
import { store } from 'lightning-store'
import BitcoinWallet from './BitcoinWallet'
import { Page, Head } from '../common'

const styles = reactCSS({
  default: {
    container: {
      display: 'flex',
      justifyContent: 'center',
    },
    QRContainer: {
      textAlign: 'center',
      height: 200,
      width: 200,
      paddingBottom: 20,
    },
  },
})
class FundYourWalletPage extends React.Component {
  componentWillMount() {
    this.props.fetchAddress()
    this.state = {
      address: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== 'Opening Wallet...') {
      this.setState({
        address: nextProps.address,
      })
    }
  }

  render() {
    return (
      <Page>
        <Head
          title="Fund Your Wallet"
          body="Fund your Bitcoin wallet!"
        />
        <div style={ styles.container }>
          <div style={ styles.QRContainer }>
            <QRCode.bitcoin address={ this.state.address } />
          </div>
        </div>
        <BitcoinWallet
          address={ this.state.address }
          onFetchAddress={ this.props.fetchAddress }
          onSuccess={ this.props.onCopy }
        />
      </Page>
    )
  }
}

export default connect(
  state => ({ address: store.getAddress(state) }),
  {
    fetchAddress: actions.fetchAddress,
    onCopy: notificationActions.addNotification,
  },
)(FundYourWalletPage)
export { default as reducer, actions, selectors } from './reducer'
