import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { Button, BackButton } from '../component/button';
import { ListContent, List, ListItem, ListHeader } from '../component/list';
import { Alert } from '../component/notification';
import Text from '../component/text';
import Icon from '../component/icon';
import { color, font } from '../component/style';

//
// Transaction View
//

const TransactionView = ({ store, nav }) => {
  const { computedTransactions: transactions } = store;
  return (
    <Background color={color.blackDark}>
      <Header separator>
        <BackButton onPress={() => nav.goHome()} />
        <Title title="Transactions" />
        <Button disabled onPress={() => {}} />
      </Header>
      <ListContent>
        <List
          data={transactions}
          renderHeader={() => <TransactionListHeader />}
          renderItem={item => (
            <TransactionListItem tx={item} onSelect={nav.goTransactionDetail} />
          )}
        />
      </ListContent>
    </Background>
  );
};

TransactionView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

//
// Transaction List Item
//

const iStyles = StyleSheet.create({
  wrap: {
    paddingRight: 50,
  },
  txt: {
    color: color.white,
    fontSize: font.sizeS,
  },
  bolt: {
    height: 126 * 0.14,
    width: 64 * 0.14,
  },
  btc: {
    height: 170 * 0.08,
    width: 135 * 0.08,
  },
  alert: {
    marginRight: 6,
  },
  group: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  l: { flex: 8 },
  m: { flex: 4 },
  s: { flex: 2 },
  i: { flex: 1 },
});

const statusColor = tx => {
  if (tx.type === 'lightning') {
    return tx.status === 'complete' ? color.greenSig : color.orangeSig;
  } else {
    return tx.status === 'confirmed' ? color.greenSig : color.orangeSig;
  }
};

const TransactionListItem = ({ tx, onSelect }) => (
  <ListItem onSelect={() => onSelect(tx)}>
    <View style={iStyles.i}>
      {tx.type === 'lightning' ? (
        <Icon image="lightning-bolt" style={iStyles.bolt} />
      ) : (
        <Icon image="bitcoin" style={iStyles.btc} />
      )}
    </View>
    <View style={[iStyles.m, iStyles.group]}>
      <Alert color={statusColor(tx)} style={iStyles.alert} />
      <Text style={iStyles.txt}>{tx.statusLabel}</Text>
    </View>
    <Text style={[iStyles.m, iStyles.txt]}>{tx.dateLabel}</Text>
    <View style={iStyles.l}>
      <Text style={[iStyles.txt, iStyles.wrap]} numberOfLines={1}>
        {tx.id}
      </Text>
    </View>
    <Text style={[iStyles.m, iStyles.txt]}>{tx.amountLabel}</Text>
    <Text style={[iStyles.s, iStyles.txt]}>{tx.feeLabel}</Text>
  </ListItem>
);

TransactionListItem.propTypes = {
  tx: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

//
// Transaction List Header
//

const hStyles = StyleSheet.create({
  txt: {
    color: color.greyListHeader,
    fontSize: font.sizeXS,
  },
});

const TransactionListHeader = () => (
  <ListHeader>
    <View style={iStyles.i} />
    <Text style={[iStyles.m, hStyles.txt]}>STATUS</Text>
    <Text style={[iStyles.m, hStyles.txt]}>DATE</Text>
    <Text style={[iStyles.l, hStyles.txt]}>TX ID</Text>
    <Text style={[iStyles.m, hStyles.txt]}>AMOUNT</Text>
    <Text style={[iStyles.s, hStyles.txt]}>FEE</Text>
  </ListHeader>
);

export default observer(TransactionView);
