import React from 'react';
import { StyleSheet, View } from 'react-native';
import Background from '../component/background';
import { CopyOnboardText } from '../component/text';
import MainContent from '../component/main-content';
import Icon from '../component/icon';
import { color } from '../component/style';

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 900,
    paddingLeft: 30,
    paddingRight: 30,
  },
  boltBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    width: 25,
    marginLeft: 26,
    backgroundColor: color.purple,
  },
  bolt: {
    height: 37,
    width: 19,
  },
});

const LoaderView = () => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <View style={styles.copy}>
        <CopyOnboardText>The fastest way to transfer Bitcoin.</CopyOnboardText>
        <Bolt />
      </View>
    </MainContent>
  </Background>
);

const Bolt = () => (
  <View style={styles.boltBackground}>
    <Icon image="lightning-bolt" style={styles.bolt} />
  </View>
);

export default LoaderView;
