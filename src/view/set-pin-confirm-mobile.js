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
// Set Pin Confirm View (Mobile)
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

const SetPinConfirmView = ({ store, auth }) => (
  <Background image="purple-gradient-bg">
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>Re-type PIN</CopyOnboardText>
      <Text style={styles.text}>
        {"Type your PIN again to make sure it's the correct one."}
      </Text>
      <FormStretcher>
        <PinBubbles pin={store.auth.pinVerify} />
      </FormStretcher>
      <PinKeyboard
        onInput={digit => auth.pushPinDigit({ digit, param: 'pinVerify' })}
        onBackspace={() => auth.popPinDigit({ param: 'pinVerify' })}
      />
    </MainContent>
  </Background>
);

SetPinConfirmView.propTypes = {
  store: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default observer(SetPinConfirmView);
