import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { Button, BackButton, SmallPillButton } from '../component/button';
import { ListContent, List, CardItem } from '../component/list';
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
    paddingBottom: 20,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alert: {
    marginRight: 6,
  },
  txt: {
    fontSize: font.sizeS,
    lineHeight: font.lineHeightS,
    maxWidth: 220,
    marginTop: 16,
    paddingLeft: 12,
  },
  btn: {
    marginTop: 16,
    marginLeft: 12,
  },
});

const NotificationListItem = ({ item }) => (
  <CardItem style={iStyles.item}>
    <View style={iStyles.group}>
      <Alert type={item.type} style={iStyles.alert} />
      <Text>{item.typeLabel}</Text>
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
  </CardItem>
);

NotificationListItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default observer(NotificationView);
