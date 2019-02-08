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
// Reset Pin: Current Pin View
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

const ResetPinCurrentView = ({ store, auth }) => (
  <Background image="purple-gradient-bg">
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>Current pin</CopyOnboardText>
      <Text style={styles.text}>{'First type your current pin below.'}</Text>
      <FormStretcher>
        <PinBubbles pin={store.auth.resetPinCurrent} />
      </FormStretcher>
      <PinKeyboard
        onInput={digit =>
          auth.pushPinDigit({ digit, param: 'resetPinCurrent' })
        }
        onBackspace={() => auth.popPinDigit({ param: 'resetPinCurrent' })}
      />
    </MainContent>
  </Background>
);

ResetPinCurrentView.propTypes = {
  store: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default observer(ResetPinCurrentView);
