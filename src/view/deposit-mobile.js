import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from '../component/media-query';
import { CopyText } from '../component/text';
import { SplitBackground } from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { SmallCopyButton, Button, ButtonText } from '../component/button';
import { CopiedNotification } from '../component/notification';
import CopyDarkIcon from '../../src/asset/icon/copy-dark';
import QRCode from '../component/qrcode';
import { color, smallBreakWidth } from '../component/style';

const baseStyles = {
  qrWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCode: {
    height: 170,
    width: 170,
  },
  content: {
    justifyContent: 'space-between',
  },
  copyTxt: {
    textAlign: 'center',
    maxWidth: 300,
  },
  btnWrapper: {
    alignItems: 'center',
  },
  copyBtn: {
    backgroundColor: color.glas,
  },
  doneBtn: {
    marginTop: 10,
    marginBottom: 10,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    qrCode: {
      height: 120,
      width: 120,
    },
    copyTxt: {
      maxWidth: 250,
    },
  })
);

const DepositView = ({ store, nav, invoice }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <View style={[StyleSheet.absoluteFill, styles.qrWrapper]}>
      <QRCode size={styles.qrCode.height}>{store.walletAddressUri}</QRCode>
    </View>
    <Header>
      <Title title="Add coin" />
    </Header>
    <MainContent style={styles.content}>
      <CopyText style={styles.copyTxt}>
        Scan the QR code, or copy the address to send from another wallet or
        exchange.
      </CopyText>
      <View style={styles.btnWrapper}>
        <SmallCopyButton
          onPress={() => invoice.toClipboard({ text: store.walletAddress })}
          icon={<CopyDarkIcon height={17.5} width={14} />}
          style={styles.copyBtn}
        >
          {store.walletAddress}
        </SmallCopyButton>
        <Button onPress={() => nav.goHome()} style={styles.doneBtn}>
          <ButtonText style={styles.doneBtnText}>Done</ButtonText>
        </Button>
      </View>
      <CopiedNotification
        display={store.displayCopied}
        color={color.notifyLight}
      />
    </MainContent>
  </SplitBackground>
);

DepositView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
};

export default observer(DepositView);
