import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { H1Text } from '../component/text';
import { GlasButton } from '../component/button';
import { InputField } from '../component/field';
import Card from '../component/card';
import { FormSubText, FormStretcher } from '../component/form';
import { MIN_PASSWORD_LENGTH } from '../config';

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
  card: {
    maxHeight: 350,
    maxWidth: 680,
    paddingLeft: 45,
    paddingRight: 45,
    paddingBottom: 50,
  },
  copy: {
    width: 340,
  },
  confirm: {
    marginTop: 25,
  },
});

const SetPasswordView = ({ store, wallet }) => (
  <Background image="purple-gradient-bg">
    <MainContent style={styles.content}>
      <View>
        <H1Text style={styles.title}>Set a password</H1Text>
      </View>
      <Card style={styles.card}>
        <FormSubText style={styles.copy}>
          The password must be at least {MIN_PASSWORD_LENGTH} characters long
          and is used to protect your wallet on disk.
        </FormSubText>
        <FormStretcher>
          <InputField
            placeholder="Password"
            secureTextEntry={true}
            value={store.wallet.password}
            onChangeText={password => wallet.setPassword({ password })}
          />
          <InputField
            style={styles.confirm}
            placeholder="Confirm password"
            secureTextEntry={true}
            value={store.wallet.passwordVerify}
            onChangeText={password => wallet.setPasswordVerify({ password })}
          />
        </FormStretcher>
      </Card>
      <GlasButton onPress={() => wallet.checkNewPassword()}>Next</GlasButton>
    </MainContent>
  </Background>
);

SetPasswordView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

export default observer(SetPasswordView);
