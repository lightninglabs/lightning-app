import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { PasswordCard } from '../component/password-entry';
import { Header, Title } from '../component/header';
import { H1Text } from '../component/text';
import { BackButton, Button, GlasButton } from '../component/button';
import { color } from '../component/style';

//
// Reset Password: Current Password View
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

const ResetPasswordCurrentView = ({ store, nav, wallet }) => (
  <Background color={color.blackDark}>
    <Header separator>
      <BackButton onPress={() => nav.goSettings()} />
      <Title title="Change Password" />
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent style={styles.content}>
      <H1Text style={styles.title}>Current password</H1Text>
      <PasswordCard
        copy="First type your current password below."
        placeholder="Your current password"
        password={store.wallet.password}
        onChangeText={password => wallet.setPassword({ password })}
        onSubmitEditing={() => nav.goResetPasswordNew()}
      />
      <GlasButton onPress={() => nav.goResetPasswordNew()}>Next</GlasButton>
    </MainContent>
  </Background>
);

ResetPasswordCurrentView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(ResetPasswordCurrentView);
