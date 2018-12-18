import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { Button, BackButton, RadioButton } from '../component/button';
import { SettingContent, SettingList, SettingItem } from '../component/setting';
import { color } from '../component/style';

//
// Setting Unit View
//

const SettingUnitView = ({ store, nav, setting }) => {
  return (
    <Background color={color.blackDark}>
      <Header separator>
        <BackButton onPress={() => nav.goSettings()} />
        <Title title="Bitcoin Units" />
        <Button disabled onPress={() => {}} />
      </Header>
      <SettingContent>
        <SettingList>
          <SettingItem
            name={store.satUnitLabel}
            onSelect={() => setting.setBitcoinUnit({ unit: 'sat' })}
          >
            <RadioButton selected={'sat' === store.settings.unit} />
          </SettingItem>
          <SettingItem
            name={store.bitUnitLabel}
            onSelect={() => setting.setBitcoinUnit({ unit: 'bit' })}
          >
            <RadioButton selected={'bit' === store.settings.unit} />
          </SettingItem>
          <SettingItem
            name={store.btcUnitLabel}
            onSelect={() => setting.setBitcoinUnit({ unit: 'btc' })}
          >
            <RadioButton selected={'btc' === store.settings.unit} />
          </SettingItem>
        </SettingList>
      </SettingContent>
    </Background>
  );
};

SettingUnitView.propTypes = {
  store: PropTypes.object.isRequired,
  setting: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(SettingUnitView);
