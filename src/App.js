import React, { Component } from 'react';
import Main from './views/main';

/* eslint-disable no-unused-vars */
import ActionsGrpc from './actions/grpc';
import ActionsWallet from './actions/wallet';
import ActionsLogs from './actions/logs';
import ActionsInfo from './actions/info';
import ActionsChannels from './actions/channels';
import ActionsTransactions from './actions/transactions';
import ActionsPayments from './actions/payments';
/* eslint-enable no-unused-vars */

class App extends Component {
  render() {
    return <Main />;
  }
}

export default App;
