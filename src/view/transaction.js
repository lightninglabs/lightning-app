import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { Button, BackButton } from '../component/button';
import { ListContent, List, ListItem, ListHeader } from '../component/list';
import Text from '../component/text';
import Icon from '../component/icon';
import { colors, font } from '../component/style';

//
// Transaction View
//

const TransactionView = ({ store }) => {
  const { computedTransactions: transactions } = store;
  return (
    <Background color={colors.blackDark}>
      <Header separator>
        <BackButton onPress={() => {}} />
        <Title title="Transactions" />
        <Button disabled onPress={() => {}} />
      </Header>
      <ListContent>
        <List
          data={transactions}
          renderHeader={() => <TransactionListHeader />}
          renderItem={item => <TransactionListItem tx={item} />}
        />
      </ListContent>
    </Background>
  );
};

TransactionView.propTypes = {
  store: PropTypes.object.isRequired,
};

//
// Transaction List Item
//

const iStyles = StyleSheet.create({
  wrap: {
    paddingRight: 50,
  },
  txt: {
    color: colors.white,
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
    height: 6,
    width: 6,
    borderRadius: 50,
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
  const status = tx.status.toLowerCase();
  if (tx.type === 'lightning') {
    return status === 'complete' ? colors.greenSig : colors.orangeSig;
  } else {
    return status === 'confirmed' ? colors.greenSig : colors.orangeSig;
  }
};

const TransactionListItem = ({ tx }) => (
  <ListItem>
    <View style={iStyles.i}>
      {tx.type === 'lightning' ? (
        <Icon image="lightning-bolt" style={iStyles.bolt} />
      ) : (
        <Icon image="bitcoin" style={iStyles.btc} />
      )}
    </View>
    <View style={[iStyles.m, iStyles.group]}>
      <View style={[iStyles.alert, { backgroundColor: statusColor(tx) }]} />
      <Text style={iStyles.txt}>{tx.status}</Text>
    </View>
    <Text style={[iStyles.m, iStyles.txt]}>{tx.date.toLocaleDateString()}</Text>
    <View style={iStyles.l}>
      <Text style={[iStyles.txt, iStyles.wrap]} numberOfLines={1}>
        {tx.id}
      </Text>
    </View>
    <Text style={[iStyles.m, iStyles.txt]}>{tx.amount}</Text>
    <Text style={[iStyles.s, iStyles.txt]}>{tx.fee}</Text>
  </ListItem>
);

TransactionListItem.propTypes = {
  tx: PropTypes.object.isRequired,
};

//
// Transaction List Header
//

const hStyles = StyleSheet.create({
  txt: {
    color: colors.greyText,
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
