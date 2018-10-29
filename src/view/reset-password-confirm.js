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
// Reset Password: Confirm New View
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

const ResetPasswordConfirmView = ({ store, nav, wallet }) => (
  <Background color={color.blackDark}>
    <Header separator>
      <BackButton onPress={() => nav.goResetPasswordNew()} />
      <Title title="Change Password" />
      <CancelButton onPress={() => nav.goSettings()} />
    </Header>
    <MainContent style={styles.content}>
      <H1Text style={styles.title}>Confirm password</H1Text>
      <PasswordCard
        copy="Re-type your new password to confirm it."
        placeholder="Confirm password"
        password={store.wallet.passwordVerify}
        onChangeText={password => wallet.setPasswordVerify({ password })}
        onSubmitEditing={() => wallet.checkResetPassword()}
      />
      <GlasButton onPress={() => wallet.checkResetPassword()}>Save</GlasButton>
    </MainContent>
  </Background>
);

ResetPasswordConfirmView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(ResetPasswordConfirmView);
