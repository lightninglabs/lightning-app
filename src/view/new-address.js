import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { CopyText } from '../component/text';
import { SplitBackground } from '../component/background';
import MainContent from '../component/main-content';
import { H1Text } from '../component/text';
import { CopyButton, GlasButton } from '../component/button';
import { CopiedNotification } from '../component/notification';
import CopyDarkIcon from '../../src/asset/icon/copy-dark';
import QRCode from '../component/qrcode';
import { color } from '../component/style';

const styles = StyleSheet.create({
  qrWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'space-between',
  },
  buttons: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  copyBtn: {
    backgroundColor: color.blackDark,
    marginBottom: 40,
  },
  copied: {
    bottom: 180,
  },
});

const NewAddressView = ({ store, invoice, info }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <View style={[StyleSheet.absoluteFill, styles.qrWrapper]}>
      <QRCode size={130}>{store.walletAddressUri}</QRCode>
    </View>
    <MainContent style={styles.content}>
      <CopySection />
      <View style={styles.buttons}>
        <CopyButton
          onPress={() => invoice.toClipboard({ text: store.walletAddress })}
          icon={<CopyDarkIcon height={17.5} width={14} />}
          style={styles.copyBtn}
        >
          {store.walletAddress}
        </CopyButton>
        <GlasButton onPress={() => info.initLoaderSyncing()}>Done</GlasButton>
      </View>
      <CopiedNotification
        display={store.displayCopied}
        color={color.notifyDark}
        style={styles.copied}
      />
    </MainContent>
  </SplitBackground>
);

NewAddressView.propTypes = {
  store: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
};

//
// Copy Section
//

const copyStyles = StyleSheet.create({
  wrapper: {
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
  },
});

const CopySection = () => (
  <View style={copyStyles.wrapper}>
    <H1Text style={copyStyles.title}>Your shiny new address</H1Text>
    <CopyText style={copyStyles.copyTxt}>
      Scan the QR code, or copy the address to send from another wallet or
      exchange. Only Bitcoin works at the moment.
    </CopyText>
  </View>
);

export default observer(NewAddressView);
