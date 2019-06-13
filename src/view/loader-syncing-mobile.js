import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from '../component/media-query';
import Background from '../component/background';
import { CopyOnboardText, CopyText } from '../component/text';
import MainContent from '../component/main-content';
import { LoadNetworkSpinner } from '../component/spinner';
import { color, smallBreakWidth } from '../component/style';

const styles = StyleSheet.create({
  spinner: {
    marginTop: 60,
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

const baseCopyStyles = {
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {},
  copyTxt: {
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 280,
    paddingBottom: 30,
  },
};

const copyStyles = createStyles(
  baseCopyStyles,

  maxWidth(smallBreakWidth, {
    title: {
      fontSize: 35,
    },
    copyTxt: {
      maxWidth: 240,
    },
  })
);

const CopySection = () => (
  <View style={copyStyles.wrapper}>
    <CopyOnboardText style={copyStyles.title}>Almost there</CopyOnboardText>
    <CopyText style={copyStyles.copyTxt}>
      Why not grab a coffee. This could take a few minutes.
    </CopyText>
  </View>
);

export default LoaderSyncingView;
