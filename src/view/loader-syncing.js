import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { H1Text, CopyText } from '../component/text';
import MainContent from '../component/main-content';
import { LoadNetworkSpinner } from '../component/spinner';
import { color } from '../component/style';

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    marginTop: 40,
  },
  downBtn: {
    margin: 25,
  },
});

const LoaderSyncingView = ({ store }) => (
  <Background color={color.blackDark}>
    <MainContent>
      <LoadNetworkSpinner
        percentage={store.percentSynced}
        msg={store.loadingMsg}
        style={styles.spinner}
      />
      <CopySection />
    </MainContent>
  </Background>
);

LoaderSyncingView.propTypes = {
  store: PropTypes.object.isRequired,
};

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
    marginTop: 40,
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 450,
    paddingBottom: 30,
  },
});

const CopySection = () => (
  <View style={copyStyles.wrapper}>
    <H1Text style={copyStyles.title}>Almost there</H1Text>
    <CopyText style={copyStyles.copyTxt}>
      Why not grab a coffee. This could take a while.
    </CopyText>
  </View>
);

export default LoaderSyncingView;
