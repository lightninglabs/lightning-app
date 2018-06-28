import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { DetailField } from '../component/field';
import Modal from '../component/modal';
import { color } from '../component/style';

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
});

const TransactionDetailView = ({ store, nav }) => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <Modal title="Transaction Details" onClose={() => nav.goBack()}>
        <DetailField name="ID">{store.selectedTransaction.id}</DetailField>
        <DetailField name="Type">
          {store.selectedTransaction.typeLabel}
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
      </Modal>
    </MainContent>
  </Background>
);

TransactionDetailView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(TransactionDetailView);
