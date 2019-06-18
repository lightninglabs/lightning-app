import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { SplitBackground } from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { Button, BackButton } from '../component/button';
import Card from '../component/card';
import LightningBoltIcon from '../asset/icon/lightning-bolt';
import BitcoinIcon from '../asset/icon/bitcoin';
import { DetailField } from '../component/field';
import { color } from '../component/style';

const styles = StyleSheet.create({
  header: {
    height: 75,
    zIndex: 1,
  },
  backBtn: {
    marginBottom: 9,
  },
  titleWrapper: {
    alignItems: 'center',
    marginTop: 40,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bolt: {
    backgroundColor: color.purple,
  },
  btc: {
    backgroundColor: color.orangeSig,
  },
});

const TransactionDetailView = ({ store, nav }) => (
  <SplitBackground
    image={
      store.selectedTransaction.type === 'bitcoin'
        ? 'orange-gradient-bg'
        : 'purple-gradient-bg'
    }
    bottom={color.whiteBg}
  >
    <Header style={styles.header}>
      <BackButton style={styles.backBtn} onPress={() => nav.goTransactions()} />
      <View style={styles.titleWrapper}>
        <Title title="Transaction Detail" />
        {store.selectedTransaction.type === 'bitcoin' ? (
          <View style={[styles.icon, styles.btc]}>
            <BitcoinIcon height={135 * 0.19} width={170 * 0.19} />
          </View>
        ) : (
          <View style={[styles.icon, styles.bolt]}>
            <LightningBoltIcon height={126 * 0.23} width={64 * 0.23} />
          </View>
        )}
      </View>
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent>
      <Card>
        <DetailField name={store.selectedTransaction.idName}>
          {store.selectedTransaction.id}
        </DetailField>
        <DetailField name="Date">
          {store.selectedTransaction.dateTimeLabel}
        </DetailField>
        {store.selectedTransaction.memo ? (
          <DetailField name="Note">
            {store.selectedTransaction.memo}
          </DetailField>
        ) : null}
        <DetailField name="Amount">
          {store.selectedTransaction.amountLabel} {store.unitLabel}
        </DetailField>
        <DetailField name="Fee">
          {store.selectedTransaction.feeLabel} {store.unitLabel}
        </DetailField>
        {store.selectedTransaction.confirmationsLabel ? (
          <DetailField name="Confirmations">
            {store.selectedTransaction.confirmationsLabel}
          </DetailField>
        ) : null}
        <DetailField name="Status">
          {store.selectedTransaction.statusLabel}
        </DetailField>
        {store.selectedTransaction.preimage ? (
          <DetailField name="Proof of Payment">
            {store.selectedTransaction.preimage}
          </DetailField>
        ) : null}
      </Card>
    </MainContent>
  </SplitBackground>
);

TransactionDetailView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(TransactionDetailView);
