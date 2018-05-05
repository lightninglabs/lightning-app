import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Container from '../component/container';
import Home from './home';
import Payment from './payment';
import Invoice from './invoice';
import InvoiceQR from './invoice-qr';
import Deposit from './deposit';
import Transaction from './transaction';
import { nav, wallet, payment, invoice } from '../action';
import store from '../store';

class MainView extends Component {
  render() {
    const { route } = store;
    return (
      <Container>
        {route === 'Home' && (
          <Home
            store={store}
            wallet={wallet}
            payment={payment}
            invoice={invoice}
            nav={nav}
          />
        )}
        {route === 'Payment' && (
          <Payment store={store} payment={payment} nav={nav} />
        )}
        {route === 'Invoice' && (
          <Invoice store={store} invoice={invoice} nav={nav} />
        )}
        {route === 'InvoiceQR' && <InvoiceQR store={store} nav={nav} />}
        {route === 'FundWallet' && <Deposit store={store} nav={nav} />}
        {route === 'Transactions' && <Transaction store={store} nav={nav} />}
      </Container>
    );
  }
}

export default observer(MainView);
