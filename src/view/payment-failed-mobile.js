import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { CopyOnboardText, CopyText } from '../component/text';
import { Button, ButtonText, SmallGlasButton } from '../component/button';
import LightningErrorIcon from '../../src/asset/icon/lightning-error';
import { createStyles, maxWidth } from '../component/media-query';
import { color, font, smallBreakWidth } from '../component/style';

const baseStyles = {
  content: {
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerTxt: {
    marginTop: 25,
    marginBottom: 10,
  },
  copyTxt: {
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 5,
    marginBottom: 10,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    headerTxt: {
      fontSize: font.sizeXXL - 5,
    },
  })
);

const PaymentFailedView = ({ channel, nav }) => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <LightningErrorIcon height={115 * 0.8} width={60 * 0.8} />
      <CopyOnboardText style={styles.headerTxt}>No route found</CopyOnboardText>
      <CopyText style={styles.copyTxt}>
        {"You'll need to manually create a channel."}
      </CopyText>
    </MainContent>
    <SmallGlasButton onPress={() => channel.initCreate()}>
      Create channel
    </SmallGlasButton>
    <Button style={styles.retryBtn} onPress={() => nav.goPayLightningConfirm()}>
      <ButtonText>Try again</ButtonText>
    </Button>
  </Background>
);

PaymentFailedView.propTypes = {
  channel: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(PaymentFailedView);
