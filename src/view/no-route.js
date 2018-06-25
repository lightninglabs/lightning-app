import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { H1Text, CopyText } from '../component/text';
import { FormStretcher } from '../component/form';
import { Button, ButtonText, PillButton } from '../component/button';
import Icon from '../component/icon';
import { color } from '../component/style';

const styles = StyleSheet.create({
  icon: {
    height: 115 * 0.8,
    width: 60 * 0.8,
    marginBottom: 25,
  },
  copyTxt: {
    marginTop: 10,
  },
  createBtn: {
    alignSelf: 'center',
    backgroundColor: color.glas,
    width: 400,
  },
  retryBtn: {
    marginTop: 5,
    marginBottom: 25,
  },
});

const NoRouteView = ({ channel, payment }) => (
  <Background color={color.blackDark}>
    <MainContent>
      <FormStretcher>
        <Icon image="lightning-error" style={styles.icon} />
        <H1Text>No route found</H1Text>
        <CopyText style={styles.copyTxt}>
          {"You'll need to manually create a channel"}
        </CopyText>
      </FormStretcher>
      <PillButton style={styles.createBtn} onPress={() => channel.initCreate()}>
        Create channel
      </PillButton>
      <Button style={styles.retryBtn} onPress={() => payment.init()}>
        <ButtonText>Try again</ButtonText>
      </Button>
    </MainContent>
  </Background>
);

NoRouteView.propTypes = {
  channel: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

export default observer(NoRouteView);
