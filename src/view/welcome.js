import React from 'react';
import { View, StyleSheet } from 'react-native';
import Background from '../component/background';
import BoltIcon from '../asset/icon/lightning-bolt';
import LightningWord from '../asset/icon/lightning-word';
import Text from '../component/text';

const styles = StyleSheet.create({
  background: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boltWrapper: {
    marginTop: 20,
  },
  wordWrapper: {
    marginTop: 20,
  },
  subtitle: {
    marginTop: 12,
    fontFamily: 'OpenSans Light',
  },
});

const WelcomeView = () => (
  <Background image="textured-bg" style={styles.background}>
    <View style={styles.boltWrapper}>
      <BoltIcon height={64 * 1.3} width={126 * 1.3} />
    </View>
    <View style={styles.wordWrapper}>
      <LightningWord height={31.2} width={245.7} />
    </View>
    <Text style={styles.subtitle}>By Lightning Labs, INC</Text>
  </Background>
);

export default WelcomeView;
