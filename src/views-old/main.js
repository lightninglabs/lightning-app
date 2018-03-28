import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Sidebar from './sidebar';
import Pay from './pay';
import Channels from './channels';
import Request from './request';
import Transactions from './transactions';
import CreateChannel from './create_channel';
import Settings from './settings';
import InitializeWallet from './initializewallet';
import VerifyWallet from './verifywallet';
import { View } from 'react-native';
import { colors } from '../components-old/styles';
import store from '../store';

class Main extends Component {
  render() {
    const { route } = store;
    return (
      <View
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: colors.offwhite,
        }}
      >
        {route === 'InitializeWallet' ? (
          <InitializeWallet />
        ) : route === 'VerifyWallet' ? (
          <VerifyWallet />
        ) : (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Sidebar />

            <View style={{ flex: 1, minWidth: 400 }}>
              {route === 'Pay' && <Pay />}
              {route === 'Request' && <Request />}
              {route === 'Channels' && <Channels />}
              {route === 'Transactions' && <Transactions />}
              {route === 'Settings' && <Settings />}
              {route === 'CreateChannel' && <CreateChannel />}
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default observer(Main);
