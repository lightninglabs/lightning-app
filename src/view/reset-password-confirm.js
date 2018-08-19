import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { SplitBackground } from '../component/background';
import MainContent from '../component/main-content';
import { PasswordCard } from '../component/card';
import { Header, Title } from '../component/header';
import { H1Text } from '../component/text';
import { Button, GlasButton, CancelButton } from '../component/button';
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
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <Header shadow color={color.purple}>
      <Button disabled onPress={() => {}} />
      <Title title="Change Password" />
      <CancelButton onPress={() => nav.goHome()} />
    </Header>
    <MainContent style={styles.content}>
      <H1Text style={styles.title}>Confirm new password</H1Text>
      <PasswordCard
        copy="Re-type your new password to confirm it."
        placeholder="New password"
        password={store.wallet.passwordVerify}
        onChangeText={password => wallet.setPasswordVerify({ password })}
        onSubmit={() => wallet.checkResetPassword()}
        newPassword={false}
      />
      <GlasButton onPress={() => wallet.checkResetPassword()}>Save</GlasButton>
    </MainContent>
  </SplitBackground>
);

ResetPasswordConfirmView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(ResetPasswordConfirmView);
