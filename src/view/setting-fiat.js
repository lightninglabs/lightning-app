import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { Button, BackButton, RadioButton } from '../component/button';
import { SettingItem } from '../component/list';
import { createStyles, maxWidth } from '../component/media-query';
import { color, breakWidth } from '../component/style';

//
// Setting Fiat View
//

const baseStyles = {
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
};

const styles = createStyles(
  baseStyles,

  maxWidth(breakWidth, {
    content: {
      paddingTop: 50,
      paddingLeft: 20,
      paddingRight: 20,
    },
    list: {
      justifyContent: 'flex-start',
      alignSelf: 'stretch',
      width: undefined,
    },
  })
);

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
