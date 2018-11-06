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
// Set Pin View (Mobile)
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

const SetPinView = ({ store, auth }) => (
  <Background image="purple-gradient-bg">
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>Set PIN</CopyOnboardText>
      <Text style={styles.text}>
        Type the PIN you want to use to unlock your wallet.
      </Text>
      <FormStretcher>
        <PinBubbles pin={store.auth.newPin} />
      </FormStretcher>
      <PinKeyboard
        onInput={digit => auth.pushPinDigit({ digit, param: 'newPin' })}
        onBackspace={() => auth.popPinDigit({ param: 'newPin' })}
      />
    </MainContent>
  </Background>
);

SetPinView.propTypes = {
  store: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default observer(SetPinView);
