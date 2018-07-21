import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { RadioButton } from '../component/button';
import { SettingItem } from '../component/list';
import SettingContainer from './setting-container';

//
// Setting Unit View
//

const SettingUnitView = ({ store, nav, setting }) => {
  return (
    <SettingContainer title="Bitcoin Units" nav={nav}>
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
    </SettingContainer>
  );
};

SettingUnitView.propTypes = {
  store: PropTypes.object.isRequired,
  setting: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(SettingUnitView);
