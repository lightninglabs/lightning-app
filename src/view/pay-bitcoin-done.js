import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { H1Text } from '../component/text';
import { Circle } from '../component/loader';
import { Button, ButtonText, PillButton } from '../component/button';
import { FormStretcher } from '../component/form';
import Icon from '../component/icon';
import { color } from '../component/style';

const styles = StyleSheet.create({
  circle: {
    marginTop: 30,
  },
  btcIcon: {
    height: 170 * 0.65,
    width: 135 * 0.65,
    marginRight: 5,
  },
  doneBtn: {
    alignSelf: 'center',
    backgroundColor: color.glas,
    width: 400,
  },
  anotherBtn: {
    marginTop: 5,
    marginBottom: 25,
  },
});

const PayBitcoinDoneView = ({ nav, payment }) => (
  <Background image="orange-gradient-bg">
    <MainContent>
      <FormStretcher>
        <H1Text>Payment processing…</H1Text>
        <Circle style={styles.circle}>
          <Icon image="bitcoin" style={styles.btcIcon} />
        </Circle>
      </FormStretcher>
      <PillButton onPress={() => nav.goHome()} style={styles.doneBtn}>
        Done
      </PillButton>
      <Button onPress={() => payment.init()} style={styles.anotherBtn}>
        <ButtonText>ANOTHER PAYMENT</ButtonText>
      </Button>
    </MainContent>
  </Background>
);

PayBitcoinDoneView.propTypes = {
  nav: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

export default observer(PayBitcoinDoneView);
