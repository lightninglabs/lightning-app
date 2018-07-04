import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Text, H1Text, CopyText } from '../component/text';
import MainContent from '../component/main-content';
import { ResizeableSpinner } from '../component/spinner';
import { DownButton } from '../component/button';
import { color, font } from '../component/style';

const styles = StyleSheet.create({
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
      />
      <CopySection />
      <DownButton onPress={() => {}} style={styles.downBtn}>
        Learn More
      </DownButton>
    </MainContent>
  </Background>
);

LoaderSyncingView.propTypes = {
  store: PropTypes.object.isRequired,
};

//
// Load Network Spinner
//

const size = 80;
const progressWidth = 3;

const loadNetworkStyles = StyleSheet.create({
  spinner: {
    margin: 20,
  },
  bolt: {
    height: 126 / 4.5,
    width: 64 / 4.5,
  },
  copy: {
    fontSize: font.sizeXS,
    marginTop: 5,
    color: color.white,
    textAlign: 'center',
  },
});

export const LoadNetworkSpinner = ({ percentage, msg }) => (
  <View style={loadNetworkStyles.spinner}>
    <ResizeableSpinner
      percentage={percentage}
      size={size}
      progressWidth={progressWidth}
      gradient="loadNetworkGrad"
      icon="lightning-bolt"
      iconStyles={loadNetworkStyles.bolt}
    />
    <Text style={loadNetworkStyles.copy}>{msg}</Text>
  </View>
);

LoadNetworkSpinner.propTypes = {
  percentage: PropTypes.number.isRequired,
  msg: PropTypes.string.isRequired,
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
    textAlign: 'center',
    marginTop: 30,
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
      {
        "Why not learn more about what we're doing at Lightning Labs? Or grab a coffee. This could take about 30 minutes."
      }
    </CopyText>
  </View>
);

export default LoaderSyncingView;
