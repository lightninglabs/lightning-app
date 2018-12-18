import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from '../component/media-query';
import { CopyText } from '../component/text';
import { SplitBackground } from '../component/background';
import MainContent from '../component/main-content';
import { Title } from '../component/header';
import { CopyButton, Button, ButtonText } from '../component/button';
import { CopiedNotification } from '../component/notification';
import CopyDarkIcon from '../../src/asset/icon/copy-dark';
import QRCode from '../component/qrcode';
import { color, font, smallBreakWidth } from '../component/style';

const baseStyles = {
  title: {
    fontSize: font.sizeBase + 1,
    marginTop: 30,
  },
  qrWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'space-between',
  },
  copyTxt: {
    fontSize: font.sizeBase - 1,
    textAlign: 'center',
    margin: 22,
  },
  btnWrapper: {
    alignItems: 'center',
  },
  copyBtn: {
    borderRadius: 0,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: color.glas,
  },
  doneBtn: {
    height: 100,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    doneBtn: {
      height: 60,
    },
  })
);

const DepositView = ({ store, nav, invoice }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <View style={styles.qrWrapper}>
      <QRCode size={130}>{store.walletAddressUri}</QRCode>
    </View>
    <Title style={styles.title} title="Add coin" />
    <MainContent style={styles.content}>
      <CopyText style={styles.copyTxt}>
        Scan the QR code, or copy the address to send from another wallet or
        exchange.
      </CopyText>
      <View style={styles.btnWrapper}>
        <CopyButton
          onPress={() => invoice.toClipboard({ text: store.walletAddress })}
          icon={<CopyDarkIcon height={17.5} width={14} />}
          style={styles.copyBtn}
        >
          {store.walletAddress}
        </CopyButton>
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
