import React from 'react';
import { Picker, StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { Button, BackButton } from '../component/button';
import { SettingPicker } from '../component/list';
import { color } from '../component/style';
import { FIATS } from '../config';

//
// Setting Fiat View
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

const fiatEntries = Object.entries(FIATS);

const SettingFiatView = ({ store, nav, setting }) => {
  return (
    <Background color={color.blackDark}>
      <Header separator>
        <BackButton onPress={() => nav.goSettings()} />
        <Title title="Fiat Currency" />
        <Button disabled onPress={() => {}} />
      </Header>
      <MainContent style={styles.content}>
        <View style={styles.list}>
          <SettingPicker
            selectedValue={store.settings.fiat}
            onValueChange={itemValue => {
              setting.setFiatCurrency({ fiat: itemValue });
            }}
          >
            {fiatEntries.map(([fiatKey, { displayLong }]) => (
              <Picker.Item
                label={displayLong}
                value={fiatKey}
                color={color.black}
                key={fiatKey}
              />
            ))}
          </SettingPicker>
        </View>
      </MainContent>
    </Background>
  );
};

SettingFiatView.propTypes = {
  store: PropTypes.object.isRequired,
  setting: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(SettingFiatView);
