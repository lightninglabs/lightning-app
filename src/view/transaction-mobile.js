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
// Transaction View (Mobile)
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
  const { computedTransactions: transactions, unitLabel } = store;
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
              unitLabel={unitLabel}
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
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    marginTop: 8,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 0,
    backgroundColor: color.glasDarker,
    borderRadius: 7,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 34,
    width: 34,
    borderRadius: 17,
    marginRight: 10,
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  txt: {
    fontSize: font.sizeS,
  },
  subTxt: {
    opacity: 0.7,
  },
});

const TransactionListItem = ({ tx, unitLabel, onSelect }) => (
  <ListItem style={iStyles.item} onSelect={onSelect}>
    <View
      style={[
        iStyles.icon,
        {
          backgroundColor:
            tx.type === 'lightning' ? color.purple : color.orange,
        },
      ]}
    >
      {tx.type === 'lightning' ? (
        <LightningBoltIcon height={126 * 0.19} width={64 * 0.19} />
      ) : (
        <BitcoinIcon height={170 * 0.12} width={135 * 0.12} />
      )}
    </View>
    <View style={iStyles.left}>
      <View style={iStyles.status}>
        <Text style={iStyles.txt}>{tx.dateLabel}</Text>
        <Text style={[iStyles.txt, iStyles.subTxt]}>{tx.statusLabel}</Text>
      </View>
    </View>
    <View style={iStyles.right}>
      <Text>
        {tx.amountLabel} {unitLabel}
      </Text>
      <Text style={[iStyles.txt, iStyles.subTxt]}>
        {tx.feeLabel} {unitLabel}
      </Text>
    </View>
  </ListItem>
);

TransactionListItem.propTypes = {
  tx: PropTypes.object.isRequired,
  unitLabel: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default observer(TransactionView);
