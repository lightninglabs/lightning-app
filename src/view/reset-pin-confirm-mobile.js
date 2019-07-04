import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { Button, BackButton } from '../component/button';
import MainContent from '../component/main-content';
import { CopyOnboardText, Text } from '../component/text';
import { FormStretcher } from '../component/form';
import { PinBubbles, PinKeyboard } from '../component/pin-entry';
import { color } from '../component/style';

//
// Reset Pin: Confirm New View (Mobile)
//

const styles = StyleSheet.create({
  content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    marginTop: 50,
  },
  text: {
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 250,
  },
});

const ResetPinConfirmView = ({ store, auth }) => (
  <Background color={color.blackDark}>
    <Header separator>
      <BackButton onPress={() => auth.initResetPinNew()} />
      <Title title="Change PIN" />
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>Re-type PIN</CopyOnboardText>
      <Text style={styles.text}>
        {"Type your PIN again to make sure it's the correct one."}
      </Text>
      <FormStretcher>
        <PinBubbles pin={store.auth.resetPinVerify} />
      </FormStretcher>
      <PinKeyboard
        onInput={digit => auth.pushPinDigit({ digit, param: 'resetPinVerify' })}
        onBackspace={() => auth.popPinDigit({ param: 'resetPinVerify' })}
      />
    </MainContent>
  </Background>
);

ResetPinConfirmView.propTypes = {
  store: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default observer(ResetPinConfirmView);
