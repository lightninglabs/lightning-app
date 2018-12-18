import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { Button, BackButton, SmallPillButton } from '../component/button';
import { ListContent, List, ListItem } from '../component/list';
import { Alert } from '../component/notification';
import Text from '../component/text';
import { color, font } from '../component/style';

//
// Notification View (Mobile)
//

const NotificationView = ({ store, nav }) => {
  const { computedNotifications: notifications } = store;
  return (
    <Background color={color.blackDark}>
      <Header>
        <BackButton onPress={() => nav.goSettings()} />
        <Title title="Notifications" />
        <Button disabled onPress={() => {}} />
      </Header>
      <ListContent>
        <List
          data={notifications}
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
  item: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 16,
    marginBottom: 15,
    backgroundColor: color.glasDarker,
    borderBottomWidth: 0,
    borderRadius: 7,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  alert: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  alertTxt: {
    fontSize: font.sizeBase,
  },
  txt: {
    fontSize: font.sizeS,
    lineHeight: font.lineHeightS,
    width: 220,
    marginTop: 16,
    marginBottom: 20,
    paddingLeft: 20,
  },
  btn: {
    height: 34,
    width: 135,
    marginLeft: 20,
    marginBottom: 25,
  },
});

const NotificationListItem = ({ item }) => (
  <ListItem style={[iStyles.item, { height: item.handler ? 170 : 120 }]}>
    <View style={iStyles.group}>
      <Alert type={item.type} style={iStyles.alert} />
      <Text style={iStyles.alertTxt}>{item.typeLabel}</Text>
    </View>
    <Text style={iStyles.txt}>
      On {item.dateTimeLabel} {item.message}
    </Text>
    {item.handler ? (
      <SmallPillButton
        style={iStyles.btn}
        text={item.handlerLbl}
        onPress={item.handler}
      />
    ) : null}
  </ListItem>
);

NotificationListItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default observer(NotificationView);
