import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { Button, BackButton, RadioButton } from '../component/button';
import { SettingItem } from '../component/list';
import { color } from '../component/style';

//
// Setting Unit View
//

const styles = StyleSheet.create({
  content: {
    paddingBottom: 75,
    paddingLeft: 50,
    paddingRight: 50,
  },
  list: {
    flex: 1,
    justifyContent: 'center',
    width: 400,
  },
});

const SettingUnitView = ({ store, nav, setting }) => {
  return (
    <Background color={color.blackDark}>
      <Header separator>
        <BackButton onPress={() => nav.goSettings()} />
        <Title title="Bitcoin Units" />
        <Button disabled onPress={() => {}} />
      </Header>
      <MainContent style={styles.content}>
        <View style={styles.list}>
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
        </View>
      </MainContent>
    </Background>
  );
};

SettingUnitView.propTypes = {
  store: PropTypes.object.isRequired,
  setting: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(SettingUnitView);
