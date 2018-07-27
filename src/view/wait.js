import React from 'react';
import { StyleSheet } from 'react-native';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { color } from '../component/style';
import { ContinuousLoadNetworkSpinner } from '../component/spinner';

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
});

const WaitView = () => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <ContinuousLoadNetworkSpinner msg="Loading network..." />
    </MainContent>
  </Background>
);

export default WaitView;
