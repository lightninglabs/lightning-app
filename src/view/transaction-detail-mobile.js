import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { Button, BackButton } from '../component/button';
import LightningBoltIcon from '../asset/icon/lightning-bolt';
import BitcoinIcon from '../asset/icon/bitcoin';
import { DetailField } from '../component/field';
import { color } from '../component/style';

const styles = StyleSheet.create({
  header: {
    zIndex: 100,
  },
  backBtn: {
    marginBottom: 8,
  },
  titleWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 110,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: 40,
    height: 40,
    borderRadius: 35,
  },
  bolt: {
    backgroundColor: color.purple,
  },
  btc: {
    backgroundColor: color.orangeSig,
  },
  content: {
    justifyContent: 'flex-start',
    backgroundColor: color.whiteBg,
    padding: 10,
  },
  detail: {
    justifyContent: 'center',
    height: 77,
  },
});

const TransactionDetailView = ({ store, nav }) => (
  <Background
    image={
      store.selectedTransaction.type === 'bitcoin'
        ? 'orange-gradient-bg'
        : 'purple-gradient-bg'
    }
  >
    <Header style={styles.header}>
      <BackButton style={styles.backBtn} onPress={() => nav.goTransactions()} />
      <View style={styles.titleWrapper}>
        <Title title="Transaction Detail" />
        {store.selectedTransaction.type === 'bitcoin' ? (
          <View style={[styles.icon, styles.btc]}>
            <BitcoinIcon height={25} width={20} />
          </View>
        ) : (
          <View style={[styles.icon, styles.bolt]}>
            <LightningBoltIcon height={35} width={29} />
          </View>
        )}
      </View>
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent style={styles.content}>
      {store.selectedTransaction.confirmationsLabel ? (
        <DetailField style={styles.detail} name="Confirmations">
          {store.selectedTransaction.confirmationsLabel}
        </DetailField>
      ) : null}
      <DetailField name="Amount" style={styles.detail}>
        {store.selectedTransaction.amountLabel} {store.unitLabel}
      </DetailField>
      <DetailField
        name={store.selectedTransaction.idName}
        style={styles.detail}
      >
        {store.selectedTransaction.id}
      </DetailField>
      <DetailField name="Fee" style={styles.detail}>
        {store.selectedTransaction.feeLabel} {store.unitLabel}
      </DetailField>
      <DetailField name="Date" style={styles.detail}>
        {store.selectedTransaction.dateTimeLabel}
      </DetailField>
      <DetailField name="Status" style={styles.detail}>
        {store.selectedTransaction.statusLabel}
      </DetailField>
      {store.selectedTransaction.memo ? (
        <DetailField name="Memo" style={styles.detail}>
          {store.selectedTransaction.memo}
        </DetailField>
      ) : null}
    </MainContent>
  </Background>
);

TransactionDetailView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(TransactionDetailView);
