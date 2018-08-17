import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { H1Text } from '../component/text';
import { Circle } from '../component/loader';
import { Button, ButtonText, PillButton } from '../component/button';
import { FormStretcher } from '../component/form';
import LightningBoltIcon from '../asset/icon/lightning-bolt';
import { color } from '../component/style';

const styles = StyleSheet.create({
  circle: {
    marginTop: 30,
  },
  iconWrapper: {
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

const PayLightningDoneView = ({ nav, payment }) => (
  <Background image="purple-gradient-bg">
    <MainContent>
      <FormStretcher>
        <H1Text>Payment Sent!</H1Text>
        <Circle style={styles.circle}>
          <View style={styles.iconWrapper}>
            <LightningBoltIcon height={126 * 0.9} width={64 * 0.9} />
          </View>
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

PayLightningDoneView.propTypes = {
  nav: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

export default observer(PayLightningDoneView);
