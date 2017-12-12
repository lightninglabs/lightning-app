import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Text, TextB } from '../components/text';
import { Image, View, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../styles';
import store from '../store';

class Settings extends Component {
  componentDidUpdate() {
    this.scrollview && this.scrollview.scrollToEnd();
  }

  render() {
    const { logs } = store;
    return (
      <View style={{ flex: 1, padding: 20, backgroundColor: colors.offwhite }}>
        <Text style={{ color: colors.gray, fontSize: 24, marginBottom: 14 }}>
          Settings
        </Text>
        <Text style={{ color: colors.lightgray }}>
          Settings and logs for your wallet and the Lightning app
        </Text>

        <Text style={{ color: colors.lightgray, margin: 4, marginTop: 30 }}>
          Logs
        </Text>
        <ScrollView
          ref={o => (this.scrollview = o)}
          style={{
            flex: 1,
            backgroundColor: 'white',
            margin: 4,
            shadowRadius: 4,
            shadowOpacity: 0.3,
            shadowColor: 'black',
            shadowOffset: { width: 1, height: 1 },
          }}
        >
          {logs.map((line, index) => (
            <Text key={index} style={{ margin: 4 }}>
              {line}
            </Text>
          ))}
        </ScrollView>
      </View>
    );
  }
}

export default observer(Settings);
