import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import Background from '../component/background';
import MainContent from '../component/main-content';
import Text from '../component/text';
import { color, font } from '../component/style';

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  spinner: {
    transform: [{ scale: 1.5 }],
  },
  copy: {
    marginTop: 15,
    fontSize: font.sizeXS,
    color: color.white,
  },
});

const WaitView = () => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <ActivityIndicator
        size="large"
        color={color.lightPurple}
        style={styles.spinner}
      />
      <Text style={styles.copy}>Loading network...</Text>
    </MainContent>
  </Background>
);

export default WaitView;
