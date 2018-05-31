import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Container from '../component/container';
import { NotificationBar } from '../component/notification';
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
import Channel from './channel';
import ChannelDetail from './channel-detail';
import ChannelDelete from './channel-delete';
import ChannelCreate from './channel-create';
import Transaction from './transaction';
import TransactionDetail from './transaction-detail';
import { nav, wallet, payment, invoice, channel, transaction } from '../action';
import store from '../store';

class MainView extends Component {
  render() {
    const { route, lastNotification, displayNotification } = store;
    return (
      <Container>
        <NotificationBar
          notification={lastNotification}
          display={displayNotification}
        />
        {route === 'Home' && (
          <Home
            store={store}
            wallet={wallet}
            channel={channel}
            payment={payment}
            invoice={invoice}
            transaction={transaction}
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
        {route === 'Channels' && (
          <Channel store={store} channel={channel} nav={nav} />
        )}
        {route === 'ChannelDetail' && (
          <ChannelDetail store={store} channel={channel} nav={nav} />
        )}
        {route === 'ChannelDelete' && (
          <ChannelDelete store={store} channel={channel} nav={nav} />
        )}
        {route === 'ChannelCreate' && (
          <ChannelCreate store={store} channel={channel} nav={nav} />
        )}
        {route === 'Transactions' && (
          <Transaction store={store} transaction={transaction} nav={nav} />
        )}
        {route === 'TransactionDetail' && (
          <TransactionDetail store={store} channel={channel} nav={nav} />
        )}
      </Container>
    );
  }
}

export default observer(MainView);
