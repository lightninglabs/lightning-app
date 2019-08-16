import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { DetailField } from '../component/field';
import { Button, ButtonText } from '../component/button';
import Modal from '../component/modal';
import { color, font } from '../component/style';

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  modal: {
    paddingBottom: 0,
  },
  deleteBtn: {
    marginTop: 15,
    minHeight: 50,
  },
  deleteBtnText: {
    color: color.pinkSig,
    fontSize: font.sizeS,
  },
  bottomPadding: {
    paddingBottom: 30,
  },
});

const ChannelDetailView = ({ store, nav }) => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <Modal
        title="Channel Details"
        style={styles.modal}
        onClose={() => nav.goChannels()}
      >
        <DetailField name="Funding Transaction ID">
          {store.selectedChannel.fundingTxId}
        </DetailField>
        {store.selectedChannel.closingTxId ? (
          <DetailField name="Closing Transaction ID">
            {store.selectedChannel.closingTxId}
          </DetailField>
        ) : null}
        <DetailField name="Remote Node Public Key">
          {store.selectedChannel.remotePubkey}
        </DetailField>
        <DetailField name="Status">
          {store.selectedChannel.statusLabel}
        </DetailField>
        {store.selectedChannel.timeTilAvailable ? (
          <DetailField name="Time Till Available">
            {store.selectedChannel.timeTilAvailable}
          </DetailField>
        ) : null}
        <DetailField name="Capacity">
          {store.selectedChannel.capacityLabel} {store.unitLabel}
        </DetailField>
        <DetailField name="Balance">
          {store.selectedChannel.localBalanceLabel} {store.unitLabel}
        </DetailField>
        {!/close|closing/i.test(store.selectedChannel.status) ? (
          <Button
            style={styles.deleteBtn}
            onPress={() => nav.goChannelDelete()}
          >
            <ButtonText style={styles.deleteBtnText}>CLOSE CHANNEL</ButtonText>
          </Button>
        ) : (
          <View style={styles.bottomPadding} />
        )}
      </Modal>
    </MainContent>
  </Background>
);

ChannelDetailView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(ChannelDetailView);
