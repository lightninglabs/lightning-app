import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import ShieldIcon from '../asset/icon/shield';
import { CopyOnboardText, Text } from '../component/text';
import { GlasButton } from '../component/button';
import { createStyles, maxWidth } from '../component/media-query';
import { smallBreakWidth } from '../component/style';

//
// Seed Success (Mobile) View
//

const baseStyles = {
  content: {
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    marginTop: 50,
    textAlign: 'center',
  },
  shield: {
    height: 281,
    width: 218,
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 50,
    maxWidth: 300,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    shield: {
      height: 281 * 0.55,
      width: 218 * 0.55,
    },
  })
);

const SeedSuccessView = ({ wallet }) => (
  <Background image="purple-gradient-bg">
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>Safe and secure</CopyOnboardText>
      <ShieldIcon height={styles.shield.height} width={styles.shield.width} />
      <Text style={styles.copyTxt}>
        {"With your key in a safe place, let's get some coin into your wallet."}
      </Text>
    </MainContent>
    <GlasButton onPress={() => wallet.initInitialDeposit()}>
      Add some coin
    </GlasButton>
  </Background>
);

SeedSuccessView.propTypes = {
  wallet: PropTypes.object.isRequired,
};

export default observer(SeedSuccessView);
