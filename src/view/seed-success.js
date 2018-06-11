import React from 'react';
import { StyleSheet, View } from 'react-native';
import MainContent from '../component/main-content';
import Background from '../component/background';
import Icon from '../component/icon';
import { H1Text, CopyText } from '../component/text';
import { GlasButton } from '../component/button';

const styles = StyleSheet.create({
  info: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    height: 272,
    width: 210,
    marginBottom: 60,
  },
  title: {
    textAlign: 'center',
    paddingBottom: 20,
  },
  copy: {
    textAlign: 'center',
    maxWidth: 487,
    paddingBottom: 15,
  },
});

const SeedSuccessView = () => (
  <Background image="purple-gradient-bg">
    <MainContent>
      <View style={styles.info}>
        <Icon image="shield" style={styles.icon} />
        <H1Text style={styles.title}>Good job you!</H1Text>
        <CopyText style={styles.copy}>
          {
            "Now that you're safe and secure, let's get some coin into your wallet."
          }
        </CopyText>
      </View>
      <GlasButton onPress={() => {}}>Add some coin</GlasButton>
    </MainContent>
  </Background>
);

export default SeedSuccessView;
