import React from 'react';
import { StyleSheet, View } from 'react-native';
import Background from '../component/background';
import { H1Text, CopyText } from '../component/text';
import MainContent from '../component/main-content';
import { LoadNetworkSpinner } from '../component/spinner';
import { color } from '../component/style';

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

const LoaderSyncingView = () => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <LoadNetworkSpinner percentage={30} msg="Loading network..." />
      <CopySection />
    </MainContent>
  </Background>
);

//
// Copy Section
//

const copyStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: 60,
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 450,
    paddingBottom: 100,
  },
});

const CopySection = () => (
  <View style={copyStyles.wrapper}>
    <H1Text style={copyStyles.title}>Almost there</H1Text>
    <CopyText style={copyStyles.copyTxt}>
      Why not learn more about what we're doing at Lightning Labs?
      Or grab a coffee. This could take about 30 minutes.
    </CopyText>
  </View>
);

export default LoaderSyncingView;
