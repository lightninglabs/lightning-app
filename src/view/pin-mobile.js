import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import BoltIcon from '../asset/icon/lightning-bolt';
import LightningWord from '../asset/icon/lightning-word';
import { Text } from '../component/text';
import { FormStretcher } from '../component/form';
import { PinBubbles, PinKeyboard } from '../component/pin-entry';

//
// Pin View (Mobile)
//

const styles = StyleSheet.create({
  content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  boltWrapper: {
    marginTop: 50,
  },
  wordWrapper: {
    marginTop: 35,
  },
  bubbles: {
    marginTop: 10,
  },
});

class PinView extends React.Component {
  componentDidMount() {
    this.props.auth.tryFingerprint();
  }

  render() {
    const { store, auth } = this.props;
    return (
      <Background image="purple-gradient-bg">
        <MainContent style={styles.content}>
          <View style={styles.boltWrapper}>
            <BoltIcon height={64 * 1.3} width={126 * 1.3} />
          </View>
          <View style={styles.wordWrapper}>
            <LightningWord height={31.2} width={245.7} />
          </View>
          <FormStretcher>
            <Text>Unlock with your pin</Text>
            <PinBubbles pin={store.auth.pin} style={styles.bubbles} />
          </FormStretcher>
          <PinKeyboard
            onInput={digit => auth.pushPinDigit({ digit, param: 'pin' })}
            onBackspace={() => auth.popPinDigit({ param: 'pin' })}
            onHelp={() => auth.askForHelp()}
          />
        </MainContent>
      </Background>
    );
  }
}

PinView.propTypes = {
  store: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default observer(PinView);
