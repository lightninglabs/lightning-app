import React, { Component } from 'react';
import { observer } from 'mobx-react';
import createBrowserHistory from 'history/createBrowserHistory';
import { Router, Route } from 'react-router-dom';
import { syncHistoryWithStore } from 'mobx-react-router';
import Container from './component/container';
import { NotificationBar } from './component/notification';
import Welcome from './view/welcome';
import Loader from './view/loader';
import Seed from './view/seed';
import SeedVerify from './view/seed-verify';
import SeedSuccess from './view/seed-success';
import SetPassword from './view/set-password';
import Password from './view/password';
import NewAddress from './view/new-address';
import Home from './view/home';
import Payment from './view/payment';
import PayLightningConfirm from './view/pay-lightning-confirm';
import PayLightningDone from './view/pay-lightning-done';
import PayBitcoin from './view/pay-bitcoin';
import PayBitcoinConfirm from './view/pay-bitcoin-confirm';
import PayBitcoinDone from './view/pay-bitcoin-done';
import Invoice from './view/invoice';
import InvoiceQR from './view/invoice-qr';
import Deposit from './view/deposit';
import Channel from './view/channel';
import ChannelDetail from './view/channel-detail';
import ChannelDelete from './view/channel-delete';
import ChannelCreate from './view/channel-create';
import Transaction from './view/transaction';
import Setting from './view/setting';
import SettingUnit from './view/setting-unit';
import SettingFiat from './view/setting-fiat';
import Notification from './view/notification';
import TransactionDetail from './view/transaction-detail';
import {
  nav,
  wallet,
  payment,
  invoice,
  channel,
  transaction,
  setting,
} from './action';
import store from './store';

const history = syncHistoryWithStore(createBrowserHistory(), store.route);

class Navigator extends Component {
  render() {
    const { lastNotification, displayNotification } = store;
    return (
      <Router history={history}>
        <Container>
          <NotificationBar
            notification={lastNotification}
            display={displayNotification}
          />
          <Route exact path="/" component={Welcome} />
          <Route exact path="/loader" component={Loader} />
          <Route
            exact
            path="/seed"
            render={() => <Seed store={store} wallet={wallet} />}
          />
          <Route
            exact
            path="/seed-verify"
            render={() => (
              <SeedVerify store={store} nav={nav} wallet={wallet} />
            )}
          />
          <Route
            exact
            path="/seed-success"
            render={() => <SeedSuccess nav={nav} />}
          />
          <Route
            exact
            path="/set-password"
            render={() => <SetPassword store={store} wallet={wallet} />}
          />
          <Route
            exact
            path="/password"
            render={() => <Password store={store} wallet={wallet} />}
          />
          <Route
            exact
            path="/new-address"
            render={() => (
              <NewAddress store={store} nav={nav} invoice={invoice} />
            )}
          />
          <Route
            exact
            path="/home"
            render={() => (
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
          />
          <Route
            exact
            path="/setting"
            render={() => <Setting store={store} nav={nav} />}
          />
          <Route
            exact
            path="/setting-unit"
            render={() => (
              <SettingUnit store={store} nav={nav} setting={setting} />
            )}
          />
          <Route
            exact
            path="/setting-fiat"
            render={() => (
              <SettingFiat store={store} nav={nav} setting={setting} />
            )}
          />
          <Route
            exact
            path="/notification"
            render={() => <Notification store={store} nav={nav} />}
          />
          <Route
            exact
            path="/payment"
            render={() => <Payment store={store} payment={payment} nav={nav} />}
          />
          <Route
            exact
            path="/pay-lightning-confirm"
            render={() => (
              <PayLightningConfirm store={store} payment={payment} nav={nav} />
            )}
          />
          <Route
            exact
            path="/pay-lightning-done"
            render={() => (
              <PayLightningDone store={store} payment={payment} nav={nav} />
            )}
          />
          <Route
            exact
            path="/pay-bitcoin"
            render={() => (
              <PayBitcoin store={store} payment={payment} nav={nav} />
            )}
          />
          <Route
            exact
            path="/pay-bitcoin-confirm"
            render={() => (
              <PayBitcoinConfirm store={store} payment={payment} nav={nav} />
            )}
          />
          <Route
            exact
            path="/pay-bitcoin-done"
            render={() => (
              <PayBitcoinDone store={store} payment={payment} nav={nav} />
            )}
          />
          <Route
            exact
            path="/invoice"
            render={() => <Invoice store={store} invoice={invoice} nav={nav} />}
          />
          <Route
            exact
            path="/invoice-qr"
            render={() => (
              <InvoiceQR store={store} invoice={invoice} nav={nav} />
            )}
          />
          <Route
            exact
            path="/deposit"
            render={() => <Deposit store={store} invoice={invoice} nav={nav} />}
          />
          <Route
            path="/channel"
            render={() => <Channel store={store} channel={channel} nav={nav} />}
          />
          <Route
            exact
            path="/channel-detail"
            render={() => (
              <ChannelDetail store={store} channel={channel} nav={nav} />
            )}
          />
          <Route
            exact
            path="/channel-delete"
            render={() => (
              <ChannelDelete store={store} channel={channel} nav={nav} />
            )}
          />
          <Route
            exact
            path="/channel-create"
            render={() => (
              <ChannelCreate store={store} channel={channel} nav={nav} />
            )}
          />
          <Route
            exact
            path="/transaction"
            render={() => (
              <Transaction store={store} transaction={transaction} nav={nav} />
            )}
          />
          <Route
            exact
            path="/transaction-detail"
            render={() => (
              <TransactionDetail store={store} channel={channel} nav={nav} />
            )}
          />
        </Container>
      </Router>
    );
  }
}

export default observer(Navigator);
