import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from '../component/media-query';
import { SplitBackground } from '../component/background';
import MainContent from '../component/main-content';
import { CopyOnboardText, CopyText } from '../component/text';
import { CopyButton, SmallGlasButton } from '../component/button';
import { CopiedNotification } from '../component/notification';
import CopyDarkIcon from '../../src/asset/icon/copy-dark';
import QRCode from '../component/qrcode';
import { color, smallBreakWidth } from '../component/style';

const baseStyles = {
  content: {
    justifyContent: 'space-between',
  },
  copyWrapper: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: 50,
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 250,
  },
  qrCode: {
    height: 170,
    width: 170,
  },
  buttons: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  copyBtn: {
    backgroundColor: color.blackDark,
    marginBottom: 15,
  },
  copied: {
    bottom: 180,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    title: {
      marginTop: 20,
    },
    qrCode: {
      height: 100,
      width: 100,
    },
  })
);

const NewAddressView = ({ store, invoice, nav }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <MainContent style={styles.content}>
      <View style={styles.copyWrapper}>
        <CopyOnboardText style={styles.title}>
          Your shiny new address
        </CopyOnboardText>
        <CopyText style={styles.copyTxt}>
          Scan the QR code, or copy the address to send from another wallet or
          exchange.
        </CopyText>
      </View>
      <QRCode size={styles.qrCode.height}>{store.walletAddressUri}</QRCode>
      <View style={styles.buttons}>
        <CopyButton
          onPress={() => invoice.toClipboard({ text: store.walletAddress })}
          icon={<CopyDarkIcon height={17.5} width={14} />}
          style={styles.copyBtn}
        >
          {store.walletAddress}
        </CopyButton>
        <SmallGlasButton onPress={() => nav.goSelectAutopilot()}>
          Done
        </SmallGlasButton>
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
  nav: PropTypes.object.isRequired,
};

export default observer(NewAddressView);
