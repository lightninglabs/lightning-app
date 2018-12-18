import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { CopyOnboardText, CopyText } from '../component/text';
import { FormStretcher } from '../component/form';
import { Button, ButtonText, GlasButton } from '../component/button';
import LightningErrorIcon from '../../src/asset/icon/lightning-error';
import { color } from '../component/style';

const styles = StyleSheet.create({
  headerTxt: {
    marginTop: 25,
    marginBottom: 10,
  },
  retryBtn: {
    marginTop: 5,
    marginBottom: 20,
  },
});

const PaymentFailedView = ({ channel, nav }) => (
  <Background color={color.blackDark}>
    <MainContent>
      <FormStretcher>
        <LightningErrorIcon height={115 * 0.8} width={60 * 0.8} />
        <CopyOnboardText style={styles.headerTxt}>
          No route found
        </CopyOnboardText>
        <CopyText>{"You'll need to manually create a channel."}</CopyText>
      </FormStretcher>
      <GlasButton onPress={() => channel.initCreate()}>
        Create channel
      </GlasButton>
      <Button
        style={styles.retryBtn}
        onPress={() => nav.goPayLightningConfirm()}
      >
        <ButtonText>Try again</ButtonText>
      </Button>
    </MainContent>
  </Background>
);

PaymentFailedView.propTypes = {
  channel: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(PaymentFailedView);
