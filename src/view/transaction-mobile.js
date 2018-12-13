import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { Button, BackButton } from '../component/button';
import { ListContent, List, ListItem } from '../component/list';
import Text from '../component/text';
import BitcoinIcon from '../../src/asset/icon/bitcoin';
import LightningBoltIcon from '../../src/asset/icon/lightning-bolt';
import { color, font } from '../component/style';

//
// Transaction View
//

const styles = StyleSheet.create({
  list: {
    paddingTop: 0,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

const TransactionView = ({ store, nav, transaction }) => {
  const { computedTransactions: transactions } = store;
  return (
    <Background color={color.blackDark}>
      <Header>
        <BackButton onPress={() => nav.goHome()} />
        <Title title="Transactions" />
        <Button disabled onPress={() => {}} />
      </Header>
      <ListContent style={styles.list}>
        <List
          data={transactions}
          renderItem={item => (
            <TransactionListItem
              tx={item}
              onSelect={() => transaction.select({ item })}
            />
          )}
        />
      </ListContent>
    </Background>
  );
};

TransactionView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  transaction: PropTypes.object.isRequired,
};

//
// Transaction List Item
//

const iStyles = StyleSheet.create({
  item: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    margin: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 0,
    backgroundColor: color.txNavy,
    borderRadius: 7,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'flex-start',
  },
  icon: {
    justifyContent: 'center',
    margin: 15,
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  txt: {
    color: color.white,
    fontSize: font.sizeS,
    opacity: 0.7,
  },
  amount: {
    fontSize: font.sizeBase,
    opacity: 1,
  },
  date: {
    opacity: 1,
  },
});

const TransactionListItem = ({ tx, onSelect }) => (
  <ListItem style={iStyles.item} onSelect={onSelect}>
    <View style={iStyles.left}>
      <View style={iStyles.icon}>
        {tx.type === 'lightning' ? (
          <LightningBoltIcon height={126 * 0.14} width={64 * 0.14} />
        ) : (
          <BitcoinIcon height={170 * 0.08} width={135 * 0.08} />
        )}
      </View>
      <View style={iStyles.status}>
        <Text style={[iStyles.txt, iStyles.date]}>{tx.dateLabel}</Text>
        <Text style={iStyles.txt}>{tx.statusLabel}</Text>
      </View>
    </View>
    <View style={iStyles.right}>
      <Text style={[iStyles.txt, iStyles.amount]}>{tx.unitAmountLbl}</Text>
      <Text style={[iStyles.txt]}>
        {tx.feeLabel === '0' ? '' : '-'}
        {tx.unitFeeLbl}
      </Text>
    </View>
  </ListItem>
);

TransactionListItem.propTypes = {
  tx: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default observer(TransactionView);
