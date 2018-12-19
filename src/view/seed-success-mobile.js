import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import ShieldIcon from '../asset/icon/shield-dots';
import { CopyOnboardText, CopyText } from '../component/text';
import { SmallGlasButton } from '../component/button';
import { createStyles, maxWidth } from '../component/media-query';
import { smallBreakWidth } from '../component/style';

//
// Seed Success (Mobile) View
//

const baseStyles = {
  content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 50,
    textAlign: 'center',
  },
  shield: {
    height: 290,
    width: 265,
  },
  copy: {
    textAlign: 'center',
    marginTop: 30,
    maxWidth: 200,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    title: {
      marginTop: 30,
      fontSize: 35,
    },
    shield: {
      height: 290 * 0.75,
      width: 265 * 0.75,
    },
  })
);

const SeedSuccessView = ({ wallet }) => (
  <Background image="purple-gradient-bg">
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>Safe and secure</CopyOnboardText>
      <View style={styles.wrapper}>
        <ShieldIcon height={styles.shield.height} width={styles.shield.width} />
        <CopyText style={styles.copy}>
          {
            "With your key in a safe place, let's get some coin into your wallet."
          }
        </CopyText>
      </View>
    </MainContent>
    <SmallGlasButton onPress={() => wallet.initInitialDeposit()}>
      Add some coin
    </SmallGlasButton>
  </Background>
);

SeedSuccessView.propTypes = {
  wallet: PropTypes.object.isRequired,
};

export default observer(SeedSuccessView);
