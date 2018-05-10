import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Container from '../component/container';
import Home from './home';
import Payment from './payment';
import PayLightningConfirm from './pay-lightning-confirm';
import PayLightningDone from './pay-lightning-done';
import PayBitcoin from './pay-bitcoin';
import PayBitcoinConfirm from './pay-bitcoin-confirm';
import PayBitcoinDone from './pay-bitcoin-done';
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
        {route === 'Pay' && (
          <Payment store={store} payment={payment} nav={nav} />
        )}
        {route === 'PayLightningConfirm' && (
          <PayLightningConfirm store={store} payment={payment} nav={nav} />
        )}
        {route === 'PayLightningDone' && (
          <PayLightningDone store={store} payment={payment} nav={nav} />
        )}
        {route === 'PayBitcoin' && (
          <PayBitcoin store={store} payment={payment} nav={nav} />
        )}
        {route === 'PayBitcoinConfirm' && (
          <PayBitcoinConfirm store={store} payment={payment} nav={nav} />
        )}
        {route === 'PayBitcoinDone' && (
          <PayBitcoinDone store={store} payment={payment} nav={nav} />
        )}
        {route === 'Invoice' && (
          <Invoice store={store} invoice={invoice} nav={nav} />
        )}
        {route === 'InvoiceQR' && (
          <InvoiceQR store={store} invoice={invoice} nav={nav} />
        )}
        {route === 'FundWallet' && (
          <Deposit store={store} invoice={invoice} nav={nav} />
        )}
        {route === 'Transactions' && <Transaction store={store} nav={nav} />}
      </Container>
    );
  }
}

export default observer(MainView);
