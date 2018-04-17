import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Container from '../component/container';
import Home from './home';
import Request from './request';
import Deposit from './deposit';
import Transaction from './transaction';
import { wallet, nav } from '../action';
import store from '../store';

class MainView extends Component {
  render() {
    const { route } = store;
    return (
      <Container>
        {route === 'Home' && <Home store={store} wallet={wallet} nav={nav} />}
        {route === 'Request' && <Request store={store} nav={nav} />}
        {route === 'FundWallet' && <Deposit store={store} nav={nav} />}
        {route === 'Transactions' && <Transaction store={store} nav={nav} />}
      </Container>
    );
  }
}

export default observer(MainView);
