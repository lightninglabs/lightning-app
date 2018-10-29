import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { SplitBackground } from '../component/background';
import MainContent from '../component/main-content';
import { H1Text } from '../component/text';
import { Header } from '../component/header';
import { Button, BackButton, GlasButton } from '../component/button';
import { PasswordCard } from '../component/password-entry';
import { color } from '../component/style';

//
// Restore Wallet Password View
//

const styles = StyleSheet.create({
  content: {
    justifyContent: 'flex-end',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
});

const RestorePasswordView = ({ store, wallet, nav }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <Header>
      <BackButton onPress={() => nav.goSelectSeed()} />
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent style={styles.content}>
      <H1Text style={styles.title}>Restore wallet</H1Text>
      <PasswordCard
        copy="Please enter your password."
        placeholder="Password"
        password={store.wallet.password}
        onChangeText={password => wallet.setPassword({ password })}
        onSubmitEditing={() => wallet.restoreWallet()}
      />
      <GlasButton onPress={() => wallet.restoreWallet()}>Restore</GlasButton>
    </MainContent>
  </SplitBackground>
);

RestorePasswordView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(RestorePasswordView);
