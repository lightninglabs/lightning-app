import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Sidebar from './sidebar';
import Pay from './pay';
import Text from '../components/text';
import { Image, View, TouchableOpacity } from 'react-native';
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
        }}
      >
        <Sidebar />

        {route === 'Pay' && <Pay />}
      </View>
    );
  }
}

export default observer(Main);
