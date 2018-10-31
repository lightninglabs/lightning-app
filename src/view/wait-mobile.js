import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { color } from '../component/style';

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  spinner: {
    transform: [{ scale: 1.5 }],
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
    </MainContent>
  </Background>
);

export default WaitView;
