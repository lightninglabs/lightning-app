import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { SplitBackground } from '../component/background';
import MainContent from '../component/main-content';
import { PasswordCard } from '../component/password-entry';
import { H1Text } from '../component/text';
import { GlasButton } from '../component/button';
import { color } from '../component/style';

//
// Set Password View
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

const SetPasswordView = ({ store, wallet, nav }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <MainContent style={styles.content}>
      <H1Text style={styles.title}>Set a password</H1Text>
      <PasswordCard
        copy="The password must be at least 8 characters long
          and is used to protect your wallet on disk."
        placeholder="Password"
        password={store.wallet.newPassword}
        onChangeText={password => wallet.setNewPassword({ password })}
        onSubmitEditing={() => nav.goSetPasswordConfirm()}
        newCopy={store.newPasswordCopy}
        success={store.newPasswordSuccess}
      />
      <GlasButton onPress={() => nav.goSetPasswordConfirm()}>Next</GlasButton>
    </MainContent>
  </SplitBackground>
);

SetPasswordView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(SetPasswordView);
