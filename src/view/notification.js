import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { Button, BackButton, SmallPillButton } from '../component/button';
import { ListContent, List, ListItem, ListHeader } from '../component/list';
import { Alert } from '../component/notification';
import Text from '../component/text';
import { color, font } from '../component/style';

//
// Notification View
//

const NotificationView = ({ store, nav }) => {
  const { computedNotifications: notifications } = store;
  return (
    <Background color={color.blackDark}>
      <Header separator>
        <BackButton onPress={() => nav.goBack()} />
        <Title title="Notifications" />
        <Button disabled onPress={() => {}} />
      </Header>
      <ListContent>
        <List
          data={notifications}
          renderHeader={() => <NotificationListHeader />}
          renderItem={item => <NotificationListItem item={item} />}
        />
      </ListContent>
    </Background>
  );
};

NotificationView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

//
// Notification List Item
//

const iStyles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingRight: 50,
  },
  txt: {
    color: color.white,
    fontSize: font.sizeS,
  },
  alert: {
    marginRight: 6,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  l: { flex: 8 },
  m: { flex: 3 },
  s: { flex: 2 },
  i: { flex: 1 },
});

const NotificationListItem = ({ item }) => (
  <ListItem>
    <View style={[iStyles.s, iStyles.group]}>
      <Alert type={item.type} style={iStyles.alert} />
      <Text style={iStyles.txt}>{item.typeLabel}</Text>
    </View>
    <Text style={[iStyles.m, iStyles.txt]}>{item.dateTimeLabel}</Text>
    <View style={[iStyles.l, iStyles.group]}>
      <Text style={[iStyles.txt, iStyles.wrap]} numberOfLines={1}>
        {item.message}
      </Text>
      {item.handler ? (
        <SmallPillButton text={item.handlerLbl} onPress={item.handler} />
      ) : null}
    </View>
  </ListItem>
);

NotificationListItem.propTypes = {
  item: PropTypes.object.isRequired,
};

//
// Notification List Header
//

const hStyles = StyleSheet.create({
  txt: {
    color: color.greyListHeader,
    fontSize: font.sizeXS,
  },
});

const NotificationListHeader = () => (
  <ListHeader>
    <Text style={[iStyles.s, hStyles.txt]}>TYPE</Text>
    <Text style={[iStyles.m, hStyles.txt]}>TIME</Text>
    <Text style={[iStyles.l, hStyles.txt]}>DESCRIPTION</Text>
  </ListHeader>
);

export default observer(NotificationView);
