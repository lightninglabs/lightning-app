import React from 'react';
import { View } from 'react-native';
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
// Seed Intro View
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
  icon: {
    height: 281,
    width: 218,
  },
  copyWrapper: {
    marginBottom: 50,
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 300,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    title: {
      marginTop: 25,
    },
    icon: {
      height: 281 * 0.55,
      width: 218 * 0.55,
    },
  })
);

const SeedIntroView = ({ nav }) => (
  <Background image="purple-gradient-bg">
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>
        Generate a recovery phrase
      </CopyOnboardText>
      <ShieldIcon height={styles.icon.height} width={styles.icon.width} />
      <View style={styles.copyWrapper}>
        <Text style={styles.copyTxt}>
          {"We'll generate a recovery phrase."}
        </Text>
        <Text style={styles.copyTxt}>
          {
            'This group of words will help you recover your wallet if your phone is lost, stolen, or erased.'
          }
        </Text>
      </View>
    </MainContent>
    <GlasButton onPress={() => nav.goSeed()}>Get my phrase</GlasButton>
  </Background>
);

SeedIntroView.propTypes = {
  nav: PropTypes.object.isRequired,
};

export default observer(SeedIntroView);
