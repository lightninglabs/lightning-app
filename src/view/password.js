import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { SplitBackground } from '../component/background';
import MainContent from '../component/main-content';
import { H1Text } from '../component/text';
import { GlasButton } from '../component/button';
import { PasswordCard } from '../component/password-entry';
import { color } from '../component/style';

//
// Password View
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

const PasswordView = ({ store, wallet }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <MainContent style={styles.content}>
      <H1Text style={styles.title}>Unlock wallet</H1Text>
      <PasswordCard
        copy="Please enter your password."
        placeholder="Password"
        password={store.wallet.password}
        onChangeText={password => wallet.setPassword({ password })}
        onSubmitEditing={() => wallet.checkPassword()}
      />
      <GlasButton onPress={() => wallet.checkPassword()}>Unlock</GlasButton>
    </MainContent>
  </SplitBackground>
);

PasswordView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

export default observer(PasswordView);
