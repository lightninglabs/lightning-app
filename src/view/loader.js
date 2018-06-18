import React from 'react';
import { StyleSheet, View } from 'react-native';
import Background from '../component/background';
import { CopyOnboardText } from '../component/text';
import MainContent from '../component/main-content';
import { color } from '../component/style';

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    justifyContent: 'center',
    maxWidth: 720,
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
  copy2: {
    marginTop: 25,
    paddingRight: 200,
  },
});

const LoaderView = () => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <View style={styles.copy}>
        <CopyOnboardText>The fastest way to transfer Bitcoin.</CopyOnboardText>
        <CopyOnboardText style={styles.copy2}>
          The most advanced easy-to-use wallet.
        </CopyOnboardText>
      </View>
    </MainContent>
  </Background>
);

export default LoaderView;
