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
  card: {
    maxHeight: 350,
    maxWidth: 680,
    paddingLeft: 45,
    paddingRight: 45,
    paddingBottom: 50,
  },
});

const PasswordView = ({ store, wallet }) => (
  <Background image="purple-gradient-bg">
    <MainContent style={styles.content}>
      <View>
        <H1Text style={styles.title}>Unlock wallet</H1Text>
      </View>
      <Card style={styles.card}>
        <FormSubText>Please enter your password.</FormSubText>
        <FormStretcher>
          <InputField
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            autoFocus={true}
            value={store.wallet.password}
            onChangeText={password => wallet.setPassword({ password })}
            onSubmitEditing={() => wallet.checkPassword()}
          />
        </FormStretcher>
      </Card>
      <GlasButton onPress={() => wallet.checkPassword()}>Unlock</GlasButton>
    </MainContent>
  </Background>
);

PasswordView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

export default observer(PasswordView);
