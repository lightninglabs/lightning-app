import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { nav } from '../actions';
import ComponentIcon from '../components-old/icon';
import Text from '../components-old/text';
import { colors } from '../styles';
import { View, TouchableOpacity } from 'react-native';
import store from '../store';

class Sidebar extends Component {
  renderRow(name, icon, onPress) {
    const { route } = store;
    const color = route === name ? colors.blue : colors.gray;

    return (
      <TouchableOpacity
        key={name}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8,
          paddingLeft: 12,
        }}
        onPress={() => onPress()}
      >
        <ComponentIcon icon={icon} style={{ width: 24, height: 24, color }} />
        <Text style={{ marginLeft: 6, color }}>{name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    let styleSheet = document.styleSheets[0];
    let keyframes = `@keyframes pulse {
                    0% { opacity: 1 }
                    50% { opacity: 0.8 }
                    100% { opacity: 1 }
                  }`;
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    const { computedBalance, pubKey, syncedToChain, blockHeight } = store;
    return (
      <View style={{ width: 170, backgroundColor: colors.sidebar }}>
        {this.renderRow('Pay', 'coin', () => nav.goPay())}
        {this.renderRow('Request', 'coin', () => nav.goRequest())}
        {this.renderRow('Channels', 'wallet', () => nav.goChannels())}
        {this.renderRow('Transactions', 'swap-horizontal', () =>
          nav.goTransactions()
        )}
        {this.renderRow('Settings', 'settings', () => nav.goSettings())}

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
          }}
          onPress={() => nav.goChannels()}
        >
          <ComponentIcon
            icon="account-circle"
            style={{ width: 24, height: 24, color: 'gray' }}
          />
          <Text
            numberOfLines={1}
            style={{ flex: 1, marginLeft: 6, color: 'gray' }}
          >
            {pubKey}
          </Text>
        </TouchableOpacity>
        {syncedToChain ? null : (
          <div
            style={{
              padding: 10,
              paddingBottom: 12,
              textAlign: 'center',
              backgroundColor: colors.blue,
              animationName: 'pulse',
              animationTimingFunction: 'ease-in-out',
              animationDuration: '1.5s',
              animationDelay: '0.0s',
              animationIterationCount: 'infinite',
              animationDirection: 'alternate',
            }}
            className="syncing"
          >
            Syncing to Chain
            <span
              style={{
                fontSize: 8,
                position: 'absolute',
                bottom: '2px',
                right: '2px',
              }}
            >
              {`Block Height: ${blockHeight || 'loading'}`}
            </span>
          </div>
        )}
      </View>
    );
  }
}

export default observer(Sidebar);
