import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { Button, BackButton, RadioButton } from '../component/button';
import { SettingContent, SettingList, SettingItem } from '../component/setting';
import { color } from '../component/style';

//
// Setting Fiat View
//

const SettingFiatView = ({ store, nav, setting }) => {
  return (
    <Background color={color.blackDark}>
      <Header separator>
        <BackButton onPress={() => nav.goSettings()} />
        <Title title="Fiat Currency" />
        <Button disabled onPress={() => {}} />
      </Header>
      <SettingContent>
        <SettingList>
          <SettingItem
            name={store.usdFiatLabel}
            onSelect={() => setting.setFiatCurrency({ fiat: 'usd' })}
          >
            <RadioButton selected={'usd' === store.settings.fiat} />
          </SettingItem>
          <SettingItem
            name={store.eurFiatLabel}
            onSelect={() => setting.setFiatCurrency({ fiat: 'eur' })}
          >
            <RadioButton selected={'eur' === store.settings.fiat} />
          </SettingItem>
          <SettingItem
            name={store.gbpFiatLabel}
            onSelect={() => setting.setFiatCurrency({ fiat: 'gbp' })}
          >
            <RadioButton selected={'gbp' === store.settings.fiat} />
          </SettingItem>
          <SettingItem
            name={store.mxnFiatLabel}
            onSelect={() => setting.setFiatCurrency({ fiat: 'mxn' })}
          >
            <RadioButton selected={'mxn' === store.settings.fiat} />
          </SettingItem>
        </SettingList>
      </SettingContent>
    </Background>
  );
};

SettingFiatView.propTypes = {
  store: PropTypes.object.isRequired,
  setting: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(SettingFiatView);
