import React from 'react';
import { ViewPropTypes, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { Button, BackButton } from '../component/button';
import { ListItem, ListHeader } from '../component/list';
import { CountBubble } from '../../src/component/notification';
import Text from '../component/text';
import Icon from '../component/icon';
import { color, font } from '../component/style';

//
// Settings View
//

const styles = StyleSheet.create({
  content: {
    alignItems: 'stretch',
    paddingTop: 35,
    paddingLeft: 50,
    paddingRight: 50,
  },
  advanced: {
    marginTop: 50,
  },
});

const SettingView = ({ store, nav }) => {
  return (
    <Background color={color.blackDark}>
      <Header separator>
        <BackButton onPress={() => nav.goHome()} />
        <Title title="Settings" />
        <Button disabled onPress={() => {}} />
      </Header>
      <MainContent style={styles.content}>
        <SettingsListHeader name="GENERAL" />
        <SettingsListItem
          name="Notifications"
          onSelect={() => nav.goNotifications()}
        >
          <CountBubble>{store.notificationCountLabel}</CountBubble>
        </SettingsListItem>
        <SettingsListItem
          name="Bitcoin Unit"
          label={store.selectedUnitLabel}
          onSelect={() => nav.goSettingsUnit()}
        />
        <SettingsListItem
          name="Fiat Currency"
          label={store.selectedFiatLabel}
          onSelect={() => nav.goSettingsFiat()}
        />
        <SettingsListHeader name="ADVANCED" style={styles.advanced} />
        <SettingsListItem name="CLI" onSelect={() => nav.goCLI()} />
      </MainContent>
    </Background>
  );
};

SettingView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

//
// Settings List Item
//

const iStyles = StyleSheet.create({
  item: {
    height: 60,
    paddingLeft: 0,
    paddingRight: 0,
  },
  name: {
    flex: 1,
    color: color.grey,
    fontSize: font.sizeSub,
  },
  lbl: {
    fontSize: font.sizeS,
    color: color.greyListLabel,
    opacity: 0.74,
  },
  frwd: {
    height: 15 * 0.9,
    width: 9 * 0.9,
    marginLeft: 20,
  },
});

const SettingsListItem = ({ name, onSelect, label, children }) => (
  <ListItem style={iStyles.item} onSelect={onSelect}>
    <Text style={iStyles.name}>{name}</Text>
    {label ? <Text style={iStyles.lbl}>{label}</Text> : null}
    {children}
    <Icon image="forward" style={iStyles.frwd} />
  </ListItem>
);

SettingsListItem.propTypes = {
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  label: PropTypes.string,
  children: PropTypes.node,
};

//
// Settings List Header
//

const hStyles = StyleSheet.create({
  header: {
    height: 20,
    paddingLeft: 0,
    paddingRight: 0,
  },
  txt: {
    fontFamily: 'OpenSans SemiBold',
    color: color.greyListHeader,
    fontSize: font.sizeXS,
  },
});

const SettingsListHeader = ({ name, style }) => (
  <ListHeader style={[hStyles.header, style]}>
    <Text style={[iStyles.i, hStyles.txt]}>{name}</Text>
  </ListHeader>
);

SettingsListHeader.propTypes = {
  name: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

export default observer(SettingView);
