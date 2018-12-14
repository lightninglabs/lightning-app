import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from '../component/media-query';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { H1Text, CopyText } from '../component/text';
import { FormStretcher } from '../component/form';
import { Button, ButtonText, PillButton } from '../component/button';
import { color, font, smallBreakWidth } from '../component/style';

const baseStyles = {
  h1: {},
  copyTxt: {
    textAlign: 'center',
    width: 320,
    marginTop: 10,
  },
  deleteBtn: {
    alignSelf: 'center',
    backgroundColor: color.glas,
    width: 340,
  },
  cancelBtn: {
    marginTop: 5,
    marginBottom: 25,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    h1: {
      fontSize: font.sizeXXL - 5,
    },
    copyTxt: {
      width: 280,
    },
    deleteBtn: {
      width: 280,
    },
  })
);

const ChannelDeleteView = ({ nav, channel }) => (
  <Background color={color.blackDark}>
    <MainContent>
      <FormStretcher>
        <H1Text style={styles.h1}>Are you sure?</H1Text>
        <CopyText style={styles.copyTxt}>
          If you close this channel, all sending and receiving of funds will be
          suspended.
        </CopyText>
      </FormStretcher>
      <PillButton
        style={styles.deleteBtn}
        onPress={() => channel.closeSelectedChannel()}
      >
        Close this channel
      </PillButton>
      <Button style={styles.cancelBtn} onPress={() => nav.goChannelDetail()}>
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
