import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from '../component/media-query';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { CopyOnboardText } from '../component/text';
import { Circle } from '../component/loader';
import { Button, ButtonText, SmallGlasButton } from '../component/button';
import { FormStretcher } from '../component/form';
import BitcoinIcon from '../asset/icon/bitcoin';
import { font, smallBreakWidth } from '../component/style';

const baseStyles = {
  copy: {
    fontSize: font.sizeXXL - 4,
    textAlign: 'center',
    width: 300,
  },
  circle: {
    width: 255,
    height: 255,
    marginTop: 60,
    borderRadius: 128,
    borderWidth: 8,
  },
  icon: {
    height: 170 * 0.82,
    width: 135 * 0.82,
  },
  anotherBtn: {
    marginTop: 20,
    marginBottom: 10,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    circle: {
      width: 200,
      height: 200,
      marginTop: 30,
    },
    icon: {
      height: 170 * 0.65,
      width: 135 * 0.65,
    },
  })
);

const PayBitcoinDoneView = ({ nav, payment }) => (
  <Background image="orange-gradient-bg">
    <MainContent>
      <FormStretcher>
        <CopyOnboardText style={styles.copy}>
          Payment processing…
        </CopyOnboardText>
        <Circle style={styles.circle}>
          <BitcoinIcon height={styles.icon.height} width={styles.icon.width} />
        </Circle>
      </FormStretcher>
      <SmallGlasButton onPress={() => nav.goHome()}>Done</SmallGlasButton>
      <Button onPress={() => payment.init()} style={styles.anotherBtn}>
        <ButtonText>Send another payment</ButtonText>
      </Button>
    </MainContent>
  </Background>
);

PayBitcoinDoneView.propTypes = {
  nav: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

export default observer(PayBitcoinDoneView);
