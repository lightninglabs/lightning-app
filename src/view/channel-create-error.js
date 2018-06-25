import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { H1Text, CopyText } from '../component/text';
import { Button, ButtonText, PillButton } from '../component/button';
import Icon from '../component/icon';
import { color } from '../component/style';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  icon: {
    height: 115,
    width: 58,
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

const ChannelCreateErrorView = ({ nav, channel }) => (
  <Background color={color.blackDark}>
    <MainContent>
      <View style={styles.wrapper}>
        <Icon image="lightning-error" style={styles.icon} />
        <H1Text>No route found</H1Text>
        <CopyText style={styles.copyTxt}>
          {"You'll need to manually create a channel"}
        </CopyText>
      </View>
      <PillButton
        style={styles.createBtn}
        onPress={() => nav.goChannelCreate()}
      >
        Create channel
      </PillButton>
      <Button style={styles.retryBtn} onPress={() => channel.connectAndOpen()}>
        <ButtonText>Try again</ButtonText>
      </Button>
    </MainContent>
  </Background>
);

ChannelCreateErrorView.propTypes = {
  nav: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
};

export default observer(ChannelCreateErrorView);
