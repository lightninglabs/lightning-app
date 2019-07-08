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
// Reset Pin: New Pin View (Mobile)
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

const ResetPinNewView = ({ store, auth }) => (
  <Background color={color.blackDark}>
    <Header separator>
      <BackButton onPress={() => auth.initResetPin()} />
      <Title title="Change PIN" />
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>New PIN</CopyOnboardText>
      <Text style={styles.text}>
        {'Type the new PIN you would like to use below.'}
      </Text>
      <FormStretcher>
        <PinBubbles pin={store.auth.resetPinNew} />
      </FormStretcher>
      <PinKeyboard
        onInput={digit => auth.pushPinDigit({ digit, param: 'resetPinNew' })}
        onBackspace={() => auth.popPinDigit({ param: 'resetPinNew' })}
      />
    </MainContent>
  </Background>
);

ResetPinNewView.propTypes = {
  store: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default observer(ResetPinNewView);
