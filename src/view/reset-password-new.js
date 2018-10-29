import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { PasswordCard } from '../component/password-entry';
import { Header, Title } from '../component/header';
import { H1Text } from '../component/text';
import { BackButton, GlasButton, CancelButton } from '../component/button';
import { color } from '../component/style';

//
// Reset Password: New Password View
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

const NewPasswordView = ({ store, nav, wallet }) => (
  <Background color={color.blackDark}>
    <Header separator>
      <BackButton onPress={() => nav.goResetPasswordCurrent()} />
      <Title title="Change Password" />
      <CancelButton onPress={() => nav.goSettings()} />
    </Header>
    <MainContent style={styles.content}>
      <H1Text style={styles.title}>New Password</H1Text>
      <PasswordCard
        copy="Type the new password you would like to use below. Make sure it's at least 8 alphanumeric characters and symbols."
        placeholder="New password"
        password={store.wallet.newPassword}
        onChangeText={password => wallet.setNewPassword({ password })}
        onSubmitEditing={() => nav.goResetPasswordConfirm()}
        newCopy={store.newPasswordCopy}
        success={store.newPasswordSuccess}
      />
      <GlasButton onPress={() => nav.goResetPasswordConfirm()}>Next</GlasButton>
    </MainContent>
  </Background>
);

NewPasswordView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(NewPasswordView);
