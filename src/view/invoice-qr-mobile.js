import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from '../component/media-query';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { NamedField } from '../component/field';
import { Header, Title } from '../component/header';
import {
  BackButton,
  CopyButton,
  Button,
  ButtonText,
} from '../component/button';
import {
  BalanceLabel,
  BalanceLabelNumeral,
  BalanceLabelUnit,
} from '../component/label';
import Card from '../component/card';
import QRCode from '../component/qrcode';
import { CopiedNotification } from '../component/notification';
import CopyPurpleIcon from '../asset/icon/copy-purple';
import LightningBoltIcon from '../asset/icon/lightning-bolt';
import { color, font, smallBreakWidth } from '../component/style';

const baseStyles = {
  numeral: {
    color: color.blackText,
  },
  unit: {
    color: color.blackText,
  },
  qrWrapper: {
    margin: 40,
  },
  qrcode: {
    height: 160,
    width: 160,
  },
  copyBtn: {
    alignSelf: 'stretch',
  },
  doneBtn: {
    marginTop: 15,
  },
  doneBtnText: {
    color: color.purple,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    numeral: {
      fontSize: font.sizeXXL,
      lineHeight: font.lineHeightXXL,
    },
    qrWrapper: {
      margin: 25,
      padding: 20,
    },
    qrcode: {
      height: 150,
      width: 150,
    },
    doneBtn: {
      marginTop: 0,
    },
  })
);

const InvoiceQRView = ({ store, nav, invoice }) => (
  <Background color={color.purple}>
    <Header color={color.purple}>
      <BackButton onPress={() => nav.goInvoice()} />
      <Title title="Payment Request">
        <LightningBoltIcon height={12} width={6.1} />
      </Title>
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent>
      <Card>
        <BalanceLabel>
          <BalanceLabelNumeral style={styles.numeral}>
            {store.invoiceAmountLabel}
          </BalanceLabelNumeral>
          <BalanceLabelUnit style={styles.unit}>
            {store.unitLabel}
          </BalanceLabelUnit>
        </BalanceLabel>
        <NamedField name="Note">{store.invoice.note}</NamedField>
        <QRCode size={styles.qrcode.height} style={styles.qrWrapper}>
          {store.invoice.uri}
        </QRCode>
        <CopyButton
          onPress={() => invoice.toClipboard({ text: store.invoice.encoded })}
          icon={<CopyPurpleIcon height={17.5} width={14} />}
          style={styles.copyBtn}
        >
          {store.invoice.encoded}
        </CopyButton>
        <Button onPress={() => nav.goHome()} style={styles.doneBtn}>
          <ButtonText style={styles.doneBtnText}>DONE</ButtonText>
        </Button>
      </Card>
      <CopiedNotification
        display={store.displayCopied}
        color={color.notifyDark}
      />
    </MainContent>
  </Background>
);

InvoiceQRView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
};

export default observer(InvoiceQRView);
