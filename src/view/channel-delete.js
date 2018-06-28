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

const ChannelDeleteView = ({ nav, channel }) => (
  <Background color={color.blackDark}>
    <MainContent>
      <FormStretcher>
        <H1Text>Are you sure?</H1Text>
        <CopyText style={styles.copyTxt}>
          If you delete this channel, all sending and receiving of funds will be
          suspeneded.
        </CopyText>
      </FormStretcher>
      <PillButton
        style={styles.deleteBtn}
        onPress={() => channel.closeSelectedChannel()}
      >
        Delete this channel
      </PillButton>
      <Button style={styles.cancelBtn} onPress={() => nav.goBack()}>
        <ButtonText>Cancel</ButtonText>
      </Button>
    </MainContent>
  </Background>
);

ChannelDeleteView.propTypes = {
  nav: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
};

export default observer(ChannelDeleteView);
