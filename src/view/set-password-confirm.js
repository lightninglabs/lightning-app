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
// Set Password Confirm View
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

const SetPasswordConfirmView = ({ store, wallet }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <MainContent style={styles.content}>
      <H1Text style={styles.title}>Confirm password</H1Text>
      <PasswordCard
        copy="The password must be at least 8 characters long
          and is used to protect your wallet on disk."
        placeholder="Confirm password"
        password={store.wallet.passwordVerify}
        onChangeText={password => wallet.setPasswordVerify({ password })}
        onSubmitEditing={() => wallet.checkNewPassword()}
      />
      <GlasButton onPress={() => wallet.checkNewPassword()}>Next</GlasButton>
    </MainContent>
  </SplitBackground>
);

SetPasswordConfirmView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

export default observer(SetPasswordConfirmView);
