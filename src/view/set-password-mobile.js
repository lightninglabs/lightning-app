import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { CopyOnboardText, Text } from '../component/text';
import { FormStretcher } from '../component/form';
import { PinBubbles, PinKeyboard } from '../component/pin-entry';

//
// Set Password View (Mobile)
//

const styles = StyleSheet.create({
  content: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    marginTop: 35,
  },
  text: {
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 250,
  },
});

const SetPasswordView = ({ store, wallet, nav }) => (
  <Background image="purple-gradient-bg">
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>Set PIN</CopyOnboardText>
      <Text style={styles.text}>
        Type the PIN you want to use to unlock your wallet
      </Text>
      <FormStretcher>
        <PinBubbles pin={store.wallet.newPassword} />
      </FormStretcher>
      <PinKeyboard
        onInput={digit => wallet.pushPinDigit({ digit, param: 'newPassword' })}
        onBackspace={() => wallet.popPinDigit({ param: 'newPassword' })}
      />
    </MainContent>
  </Background>
);

SetPasswordView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(SetPasswordView);
