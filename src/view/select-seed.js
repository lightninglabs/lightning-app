import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { H1Text, CopyText } from '../component/text';
import { RadioButton, GlasButton } from '../component/button';
import { SettingItem } from '../component/list';
import { color } from '../component/style';

//
// Select Seed View
//

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    paddingLeft: 50,
    paddingRight: 50,
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 450,
  },
  list: {
    marginTop: 50,
    width: 400,
  },
});

const SelectSeedView = ({ store, wallet, nav }) => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <H1Text>Recovery phrase?</H1Text>
      <CopyText style={styles.copyTxt}>
        If you already have a recovery phrase, you can use that now. Otherwise,
        you should generate a new wallet.
      </CopyText>
      <View style={styles.list}>
        <SettingItem
          name="Generate a new wallet"
          onSelect={() => wallet.setRestoringWallet({ restoring: false })}
        >
          <RadioButton selected={store.wallet.restoring === false} />
        </SettingItem>
        <SettingItem
          name="Recover an existing wallet"
          onSelect={() => wallet.setRestoringWallet({ restoring: true })}
        >
          <RadioButton selected={store.wallet.restoring === true} />
        </SettingItem>
      </View>
    </MainContent>
    <GlasButton
      onPress={() =>
        store.wallet.restoring ? wallet.initRestoreWallet() : nav.goSeed()
      }
    >
      Next
    </GlasButton>
  </Background>
);

SelectSeedView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(SelectSeedView);
