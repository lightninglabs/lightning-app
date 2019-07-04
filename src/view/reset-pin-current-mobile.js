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
// Reset Pin: Current Pin View (Mobile)
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

const ResetPinCurrentView = ({ store, nav, auth }) => (
  <Background color={color.blackDark}>
    <Header separator>
      <BackButton onPress={() => nav.goSettings()} />
      <Title title="Change PIN" />
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>Current PIN</CopyOnboardText>
      <Text style={styles.text}>{'First type your current PIN below.'}</Text>
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
  nav: PropTypes.object.isRequired,
};

export default observer(ResetPinCurrentView);
