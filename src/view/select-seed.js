import React from 'react';
import { View } from 'react-native';
import { createStyles, maxWidth } from '../component/media-query';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { CopyOnboardText, Text } from '../component/text';
import { RadioButton, GlasButton } from '../component/button';
import { SettingItem } from '../component/setting';
import { color, breakWidth } from '../component/style';

//
// Select Seed View
//

const baseStyles = {
  content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    marginTop: 60,
    textAlign: 'center',
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 300,
  },
  list: {
    marginTop: 50,
    width: 400,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(breakWidth, {
    title: {
      marginTop: 50,
    },
    list: {
      width: undefined,
      alignSelf: 'stretch',
    },
  })
);

const SelectSeedView = ({ store, wallet, setting }) => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>Recovery phrase?</CopyOnboardText>
      <Text style={styles.copyTxt}>
        If you already have a recovery phrase, you can use that now. Otherwise,
        you should generate a new wallet.
      </Text>
      <View style={styles.list}>
        <SettingItem
          name="Generate a new wallet"
          onSelect={() => setting.setRestoringWallet({ restoring: false })}
        >
          <RadioButton selected={store.settings.restoring === false} />
        </SettingItem>
        <SettingItem
          name="Recover an existing wallet"
          onSelect={() => setting.setRestoringWallet({ restoring: true })}
        >
          <RadioButton selected={store.settings.restoring === true} />
        </SettingItem>
      </View>
    </MainContent>
    <GlasButton
      onPress={async () =>
        store.settings.restoring
          ? wallet.initRestoreWallet()
          : await wallet.initSeed()
      }
    >
      Next
    </GlasButton>
  </Background>
);

SelectSeedView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  setting: PropTypes.object.isRequired,
};

export default observer(SelectSeedView);
