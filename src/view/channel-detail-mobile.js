import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { SplitBackground } from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { DetailField } from '../component/field';
import { Button, BackButton, ButtonText } from '../component/button';
import Card from '../component/card';
import { color, font } from '../component/style';

const styles = StyleSheet.create({
  btnWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    marginTop: 15,
    minHeight: 50,
  },
  deleteBtnText: {
    color: color.pinkSig,
    fontSize: font.sizeS,
  },
});

const ChannelDetailView = ({ store, nav }) => (
  <SplitBackground color={color.blackDark} bottom={color.whiteBg}>
    <Header>
      <BackButton onPress={() => nav.goChannels()} />
      <Title title="Channel Detail" />
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent>
      <Card>
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
          <View style={styles.btnWrapper}>
            <Button
              style={styles.deleteBtn}
              onPress={() => nav.goChannelDelete()}
            >
              <ButtonText style={styles.deleteBtnText}>
                CLOSE CHANNEL
              </ButtonText>
            </Button>
          </View>
        ) : null}
      </Card>
    </MainContent>
  </SplitBackground>
);

ChannelDetailView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(ChannelDetailView);
