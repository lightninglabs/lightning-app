import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { H1Text, CopyText } from '../component/text';
import { FormStretcher } from '../component/form';
import { Button, ButtonText, PillButton } from '../component/button';
import { color } from '../component/style';

const styles = StyleSheet.create({
  copyTxt: {
    marginTop: 10,
  },
  deleteBtn: {
    alignSelf: 'center',
    backgroundColor: color.glas,
    width: 400,
  },
  cancelBtn: {
    marginTop: 5,
    marginBottom: 25,
  },
});

const ChannelForceDeleteView = ({ nav, channel }) => (
  <Background color={color.blackDark}>
    <MainContent>
      <FormStretcher>
        <H1Text>Force close channel?</H1Text>
        <CopyText style={styles.copyTxt}>
          Mutual close of the channel failed. Force closing the channel will
          result in a delay to access your funds.
        </CopyText>
      </FormStretcher>
      <PillButton
        style={styles.deleteBtn}
        onPress={() => channel.closeSelectedChannel(true)}
      >
        Force close this channel
      </PillButton>
      <Button style={styles.cancelBtn} onPress={() => nav.goChannelDetail()}>
        <ButtonText>Cancel</ButtonText>
      </Button>
    </MainContent>
  </Background>
);

ChannelForceDeleteView.propTypes = {
  nav: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
};

export default observer(ChannelForceDeleteView);
