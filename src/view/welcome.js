import React from 'react';
import { StyleSheet } from 'react-native';
import Background from '../component/background';
import Icon from '../component/icon';
import Text from '../component/text';

const scale = 1.3;

const styles = StyleSheet.create({
  background: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bolt: {
    marginTop: 20,
    height: 62.725 * scale,
    width: 31.865 * scale,
  },
  name: {
    marginTop: 18,
    height: 24 * scale,
    width: 189 * scale,
  },
  subtitle: {
    marginTop: 12,
    fontFamily: 'OpenSans Light',
  },
});

const WelcomeView = () => (
  <Background image="textured-bg" style={styles.background}>
    <Icon image="lightning-bolt" style={styles.bolt} />
    <Icon image="lightning-word" style={styles.name} />
    <Text style={styles.subtitle}>By Lightning Labs, INC</Text>
  </Background>
);

export default WelcomeView;
