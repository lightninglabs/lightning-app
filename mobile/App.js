import React from 'react';
import { StyleSheet, View } from 'react-native';
import FontLoader from './component/font-loader';
import { Header, Title } from '../src/component/header';
import { CancelButton, BackButton } from '../src/component/button';
import { color } from '../src/component/style';

export default class App extends React.Component {
  render() {
    return (
      <FontLoader>
        <TestView />
      </FontLoader>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  text: {
    color: color.black,
  },
});

const TestView = () => (
  <View style={styles.container}>
    <Header shadow color={color.orange}>
      <BackButton onPress={() => {}} />
      <Title title="On-Chain Payment" />
      <CancelButton onPress={() => {}} />
    </Header>
  </View>
);
