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
import QRCode from '../component/qrcode';
import { color } from '../component/style';

const styles = StyleSheet.create({
  qrWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    alignSelf: 'center',
    marginTop: 30,
    textAlign: 'center',
  },
  content: {
    justifyContent: 'space-between',
  },
  buttons: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 25,
    maxWidth: 450,
  },
  copyBtn: {
    backgroundColor: color.blackDark,
    marginBottom: 30,
  },
  doneBtn: {
    alignSelf: 'stretch',
  },
});

const NewAddressView = ({ store, invoice }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <View style={styles.qrWrapper}>
      <QRCode size={130}>{store.walletAddressUri}</QRCode>
    </View>
    <H1Text style={styles.title}>Your shiny new address</H1Text>
    <MainContent style={styles.content}>
      <CopyText style={styles.copyTxt}>
        Scan the QR code, or copy the address to send from another wallet or
        exchange. Only Bitcoin works at the moment.
      </CopyText>
      <View style={styles.buttons}>
        <CopyButton
          onPress={() => invoice.toClipboard({ text: store.walletAddress })}
          icon="copy-dark"
          style={styles.copyBtn}
        >
          {store.walletAddress}
        </CopyButton>
        <GlasButton style={styles.doneBtn} onPress={() => {}}>
          Done
        </GlasButton>
      </View>
      <CopiedNotification
        display={store.displayCopied}
        color={color.notifyLight}
      />
    </MainContent>
  </SplitBackground>
);

NewAddressView.propTypes = {
  store: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
};

export default observer(NewAddressView);
