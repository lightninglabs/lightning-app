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

const baseCopyStyles = {
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
    maxWidth: 300,
    paddingBottom: 30,
  },
};

const copyStyles = createStyles(
  baseCopyStyles,

  maxWidth(smallBreakWidth, {
    copyTxt: {
      maxWidth: 250,
    },
  })
);

const CopySection = () => (
  <View style={copyStyles.wrapper}>
    <CopyOnboardText style={copyStyles.title}>Almost there</CopyOnboardText>
    <CopyText style={copyStyles.copyTxt}>
      {
        "We're making the final touches to get you up and running on Lightning. This could take about 30 minutes, but it will only happen once."
      }
    </CopyText>
  </View>
);

export default LoaderSyncingView;
