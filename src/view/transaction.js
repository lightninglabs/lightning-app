import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { Button, BackButton } from '../component/button';
import { ListContent, List, ListItem, ListHeader } from '../component/list';
import Text from '../component/text';
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
          renderItem={item => <TransactionListItem item={item} />}
        />
      </ListContent>
    </Background>
  );
};

TransactionView.propTypes = {
  store: PropTypes.object.isRequired,
};

//
// Transaction List Header
//

const headStyles = StyleSheet.create({
  text: {
    color: colors.greyText,
    fontSize: font.sizeXS,
  },
});

const TransactionListHeader = () => (
  <ListHeader style={headStyles.wrapper}>
    <Text style={headStyles.text}>STATUS</Text>
    <Text style={headStyles.text}>DATE</Text>
    <Text style={headStyles.text}>TX ID</Text>
    <Text style={headStyles.text}>AMOUNT</Text>
    <Text style={headStyles.text}>FEE</Text>
  </ListHeader>
);

//
// Transaction List Item
//

const itemStyles = StyleSheet.create({
  text: {
    color: colors.white,
    fontSize: font.sizeS,
  },
});

const TransactionListItem = ({ item }) => (
  <ListItem>
    <Text style={itemStyles.text}>{item.id}</Text>
    <Text style={itemStyles.text}>{item.date.toString()}</Text>
  </ListItem>
);

TransactionListItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default observer(TransactionView);
