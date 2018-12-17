import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from '../component/media-query';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { CopyOnboardText } from '../component/text';
import { Circle } from '../component/loader';
import { Button, ButtonText, GlasButton } from '../component/button';
import { FormStretcher } from '../component/form';
import LightningBoltIcon from '../asset/icon/lightning-bolt';
import { font, smallBreakWidth } from '../component/style';

const baseStyles = {
  copy: {
    fontSize: font.sizeXXL - 4,
  },
  circle: {
    width: 255,
    height: 255,
    borderRadius: 128,
    marginTop: 60,
    borderWidth: 8,
  },
  bolt: {
    height: 126 * 1.15,
    width: 64 * 1.15,
  },
  anotherBtn: {
    paddingTop: 20,
    paddingBottom: 30,
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
    bolt: {
      height: 126 * 0.9,
      width: 64 * 0.9,
    },
  })
);

const PayLightningDoneView = ({ nav, payment }) => (
  <Background image="purple-gradient-bg">
    <MainContent>
      <FormStretcher>
        <CopyOnboardText>Payment sent!</CopyOnboardText>
        <Circle style={styles.circle}>
          <LightningBoltIcon
            height={styles.bolt.height}
            width={styles.bolt.width}
          />
        </Circle>
      </FormStretcher>
      <GlasButton onPress={() => nav.goHome()}>Done</GlasButton>
      <Button onPress={() => payment.init()} style={styles.anotherBtn}>
        <ButtonText>Send another payment</ButtonText>
      </Button>
    </MainContent>
  </Background>
);

PayLightningDoneView.propTypes = {
  nav: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

export default observer(PayLightningDoneView);
