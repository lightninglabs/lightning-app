import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { Button, BackButton } from '../component/button';
import { SettingContent, SettingItem, SettingHeader } from '../component/list';
import { CountBubble } from '../component/notification';
import { createStyles, maxWidth } from '../component/media-query';
import { color, breakWidth } from '../component/style';

//
// Settings View
//

const baseStyles = {
  content: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 35,
  },
  advanced: {
    marginTop: 50,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(breakWidth, {
    content: {
      paddingTop: 35,
    },
  })
);

const SettingView = ({ store, nav, wallet }) => {
  return (
    <Background color={color.blackDark}>
      <Header separator>
        <BackButton onPress={() => nav.goHome()} />
        <Title title="Settings" />
        <Button disabled onPress={() => {}} />
      </Header>
      <SettingContent style={styles.content}>
        <SettingHeader name="GENERAL" />
        <SettingItem
          name="Notifications"
          onSelect={() => nav.goNotifications()}
          arrow
        >
          <CountBubble>{store.notificationCountLabel}</CountBubble>
        </SettingItem>
        <SettingItem
          name="Bitcoin Unit"
          label={store.selectedUnitLabel}
          onSelect={() => nav.goSettingsUnit()}
          arrow
        />
        <SettingItem
          name="Fiat Currency"
          label={store.selectedFiatLabel}
          onSelect={() => nav.goSettingsFiat()}
          arrow
        />
        <SettingItem
          name="Change Password"
          onSelect={() => wallet.initResetPassword()}
          arrow
        />
        <SettingHeader name="ADVANCED" style={styles.advanced} />
        <SettingItem name="Logs" onSelect={() => nav.goCLI()} arrow />
      </SettingContent>
    </Background>
  );
};

SettingView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

export default observer(SettingView);
