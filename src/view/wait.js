import React from 'react';
import { StyleSheet } from 'react-native';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { WaitSpinner } from '../component/spinner';
import { color } from '../component/style';

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
});

const WaitView = () => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <WaitSpinner msg="Loading network" />
    </MainContent>
  </Background>
);

export default WaitView;
