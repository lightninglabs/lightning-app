import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { RadioButton } from '../component/button';
import { SettingItem } from '../component/list';
import SettingContainer from './setting-container';

//
// Setting Locale View
//

const SettingLocaleView = ({ store, nav, setting }) => {
  return (
    <SettingContainer nav={nav} tile="Locale">
      <SettingItem
        name={store.enLocaleLabel}
        onSelect={() => setting.setLocale({ locale: 'en' })}
      >
        <RadioButton selected={'en' === store.settings.locale} />
      </SettingItem>
      <SettingItem
        name={store.deLocaleLabel}
        onSelect={() => setting.setLocale({ locale: 'de' })}
      >
        <RadioButton selected={'de' === store.settings.locale} />
      </SettingItem>
      <SettingItem
        name={store.noLocaleLabel}
        onSelect={() => setting.setLocale({ locale: 'no' })}
      >
        <RadioButton selected={'no' === store.settings.locale} />
      </SettingItem>
    </SettingContainer>
  );
};

SettingLocaleView.propTypes = {
  store: PropTypes.object.isRequired,
  setting: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(SettingLocaleView);
