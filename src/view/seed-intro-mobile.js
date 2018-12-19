import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import SeedBackupIcon from '../asset/icon/seed-backup';
import { CopyOnboardText, Text } from '../component/text';
import { SmallGlasButton } from '../component/button';
import { createStyles, maxWidth } from '../component/media-query';
import { smallBreakWidth } from '../component/style';

//
// Seed Intro View
//

const baseStyles = {
  content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    marginTop: 40,
    textAlign: 'center',
    marginBottom: 25,
  },
  icon: {
    height: 223,
    width: 221,
  },
  copyWrapper: {
    marginBottom: 50,
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 25,
    maxWidth: 250,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    title: {
      marginTop: 25,
      fontSize: 30,
      lineHeight: 40,
    },
    icon: {
      height: 223 * 0.75,
      width: 221 * 0.75,
    },
  })
);

const SeedIntroView = ({ nav }) => (
  <Background image="purple-gradient-bg">
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>
        Generate a recovery phrase
      </CopyOnboardText>
      <SeedBackupIcon height={styles.icon.height} width={styles.icon.width} />
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
    <SmallGlasButton onPress={() => nav.goSeed()}>
      Get my phrase
    </SmallGlasButton>
  </Background>
);

SeedIntroView.propTypes = {
  nav: PropTypes.object.isRequired,
};

export default observer(SeedIntroView);
