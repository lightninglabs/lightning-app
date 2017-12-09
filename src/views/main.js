import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Sidebar from './sidebar';
import Pay from './pay';
import Channels from './channels';
import Request from './request';
import Transactions from './transactions';
import Settings from './settings';
import { View } from 'react-native';
import store from '../store';

class Main extends Component {
  render() {
    const { route } = store;
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'white',
        }}
      >
        <Sidebar />

        <View style={{ flex: 1, minWidth: 400 }}>
          {route === 'Pay' && <Pay />}
          {route === 'Request' && <Request />}
          {route === 'Channels' && <Channels />}
          {route === 'Transactions' && <Transactions />}
          {route === 'Settings' && <Settings />}
        </View>
      </View>
    );
  }
}

export default observer(Main);
