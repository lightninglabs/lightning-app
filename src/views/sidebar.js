import React, { Component } from 'react';
import { observer } from 'mobx-react';

import ActionsNav from '../actions/nav';
import ComponentIcon from '../components/icon';
import Text from '../components/text';
import { colors } from '../styles';
import { Image, View, TouchableOpacity } from 'react-native';
import store from '../store';

class Sidebar extends Component {
  renderRow({ name, icon, onPress }) {
    const { route } = store;

    return (
      <TouchableOpacity
        key={name}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8,
          paddingLeft: 12,
          color: route === name ? colors.blue : colors.gray,
        }}
        onPress={() => onPress()}
      >
        <ComponentIcon icon={icon} style={{ width: 24, height: 24 }} />
        <Text style={{ marginLeft: 6 }}>{name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { computedBalance, settings: { pubkey } } = store;
    const rows = [
      {
        name: 'Pay',
        icon: 'coin',
        onPress: () => ActionsNav.goPay(),
      },
      {
        name: 'Request',
        icon: 'coin',
        onPress: () => ActionsNav.goRequest(),
      },
      {
        name: 'Channels',
        icon: 'wallet',
        onPress: () => ActionsNav.goChannels(),
      },
      {
        name: 'Settings',
        icon: 'settings',
        onPress: () => ActionsNav.goSettings(),
      },
    ];

    return (
      <View style={{ width: 170, backgroundColor: colors.sidebar }}>
        {rows.map(item => this.renderRow(item))}

        <View style={{ flex: 1 }} />

        <Text style={{ marginLeft: 14, color: colors.gray }}>
          SAT <Text style={{ color: 'white' }}>{computedBalance}</Text>
        </Text>

        <TouchableOpacity
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            paddingLeft: 12,
            color: 'gray',
          }}
          onPress={() => {}}
        >
          <ComponentIcon
            icon="account-circle"
            style={{ width: 24, height: 24 }}
          />
          <Text style={{ flex: 1, marginLeft: 6 }}>{pubkey}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default observer(Sidebar);
