import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Container from '../component/container';
import { NotificationBar } from '../component/notification';
import Welcome from './welcome';
import Loader from './loader';
import SelectSeed from './select-seed';
import Seed from './seed';
import SeedVerify from './seed-verify';
import SeedSuccess from './seed-success';
import SetPassword from './set-password';
import SetPasswordConfirm from './set-password-confirm';
import RestoreSeed from './restore-seed';
import Password from './password';
import ResetPasswordCurrent from './reset-password-current';
import ResetPasswordNew from './reset-password-new';
import ResetPasswordConfirm from './reset-password-confirm';
import ResetPasswordSaved from './reset-password-saved';
import NewAddress from './new-address';
import LoaderSyncing from './loader-syncing';
import Wait from './wait';
import Home from './home';
import Payment from './payment';
import PayLightningConfirm from './pay-lightning-confirm';
import PayLightningDone from './pay-lightning-done';
import PaymentFailed from './payment-failed';
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
import Setting from './setting';
import SettingUnit from './setting-unit';
import SettingFiat from './setting-fiat';
import Notification from './notification';
import CLI from './cli';
import TransactionDetail from './transaction-detail';
import {
  nav,
  wallet,
  payment,
  invoice,
  channel,
  transaction,
  setting,
  info,
  autopilot,
} from '../action';
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
        {route === 'Welcome' && <Welcome />}
        {route === 'Loader' && <Loader />}
        {route === 'SelectSeed' && (
          <SelectSeed store={store} wallet={wallet} setting={setting} />
        )}
        {route === 'Seed' && <Seed store={store} wallet={wallet} />}
        {route === 'SeedVerify' && (
          <SeedVerify store={store} nav={nav} wallet={wallet} />
        )}
        {route === 'SeedSuccess' && <SeedSuccess wallet={wallet} />}
        {route === 'SetPassword' && (
          <SetPassword store={store} wallet={wallet} nav={nav} />
        )}
        {route === 'SetPasswordConfirm' && (
          <SetPasswordConfirm store={store} wallet={wallet} />
        )}
        {route === 'RestoreSeed' && (
          <RestoreSeed store={store} wallet={wallet} />
        )}
        {route === 'Password' && <Password store={store} wallet={wallet} />}
        {route === 'ResetPasswordCurrent' && (
          <ResetPasswordCurrent store={store} nav={nav} wallet={wallet} />
        )}
        {route === 'ResetPasswordNew' && (
          <ResetPasswordNew store={store} nav={nav} wallet={wallet} />
        )}
        {route === 'ResetPasswordConfirm' && (
          <ResetPasswordConfirm store={store} nav={nav} wallet={wallet} />
        )}
        {route === 'ResetPasswordSaved' && (
          <ResetPasswordSaved store={store} nav={nav} wallet={wallet} />
        )}
        {route === 'NewAddress' && (
          <NewAddress store={store} invoice={invoice} info={info} />
        )}
        {route === 'LoaderSyncing' && <LoaderSyncing store={store} />}
        {route === 'Wait' && <Wait store={store} />}
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
        {route === 'Settings' && (
          <Setting
            store={store}
            nav={nav}
            wallet={wallet}
            autopilot={autopilot}
          />
        )}
        {route === 'SettingsUnit' && (
          <SettingUnit store={store} nav={nav} setting={setting} />
        )}
        {route === 'SettingsFiat' && (
          <SettingFiat store={store} nav={nav} setting={setting} />
        )}
        {route === 'Notifications' && <Notification store={store} nav={nav} />}
        {route === 'CLI' && <CLI store={store} nav={nav} />}
        {route === 'Pay' && (
          <Payment store={store} payment={payment} nav={nav} />
        )}
        {route === 'PayLightningConfirm' && (
          <PayLightningConfirm store={store} payment={payment} nav={nav} />
        )}
        {route === 'PayLightningDone' && (
          <PayLightningDone payment={payment} nav={nav} />
        )}
        {route === 'PaymentFailed' && (
          <PaymentFailed channel={channel} nav={nav} />
        )}
        {route === 'PayBitcoin' && (
          <PayBitcoin store={store} payment={payment} nav={nav} />
        )}
        {route === 'PayBitcoinConfirm' && (
          <PayBitcoinConfirm store={store} payment={payment} nav={nav} />
        )}
        {route === 'PayBitcoinDone' && (
          <PayBitcoinDone payment={payment} nav={nav} />
        )}
        {route === 'Invoice' && (
          <Invoice store={store} invoice={invoice} nav={nav} />
        )}
        {route === 'InvoiceQR' && (
          <InvoiceQR store={store} invoice={invoice} nav={nav} />
        )}
        {route === 'Deposit' && (
          <Deposit store={store} invoice={invoice} nav={nav} />
        )}
        {route === 'Channels' && (
          <Channel store={store} channel={channel} nav={nav} />
        )}
        {route === 'ChannelDetail' && <ChannelDetail store={store} nav={nav} />}
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
          <TransactionDetail store={store} nav={nav} />
        )}
      </Container>
    );
  }
}

export default observer(MainView);
