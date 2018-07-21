import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { RadioButton } from '../component/button';
import { SettingItem } from '../component/list';
import SettingContainer from './setting-container';

//
// Setting Fiat View
//

const SettingFiatView = ({ store, nav, setting }) => {
  return (
    <SettingContainer nav={nav} tile="Fiat currency">
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
    </SettingContainer>
  );
};

SettingFiatView.propTypes = {
  store: PropTypes.object.isRequired,
  setting: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(SettingFiatView);
