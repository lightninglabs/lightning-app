import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Sidebar from './sidebar';
import Pay from './pay';
import Channels from './channels';
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

        {route === 'Pay' && <Pay />}
        {route === 'Channels' && <Channels />}
      </View>
    );
  }
}

export default observer(Main);
