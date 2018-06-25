import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { Button, BackButton, RadioButton } from '../component/button';
import { ListItem } from '../component/list';
import Text from '../component/text';
import { color } from '../component/style';

//
// Bitcoin Units View
//

const styles = StyleSheet.create({
  content: {
    paddingTop: 35,
    paddingLeft: 50,
    paddingRight: 50,
  },
});

const BitcoinUnitsView = ({ store, nav, setting }) => {
  return (
    <Background color={color.blackDark} style={styles.wrapper}>
      <Header separator>
        <BackButton onPress={() => nav.goHome()} />
        <Title title="Bitcoin Units" />
        <Button disabled onPress={() => {}} />
      </Header>
      <MainContent style={styles.content}>
        <UnitsListItem
          name="Satoshi   (0.00000001 BTC)"
          type="sat"
          selectedUnit={store.settings.unit}
          onSelect={() => setting.setBitcoinUnit({ unit: 'sat' })}
        />
        <UnitsListItem
          name="Bits   (0.000001 BTC)"
          type="bit"
          selectedUnit={store.settings.unit}
          onSelect={() => setting.setBitcoinUnit({ unit: 'bit' })}
        />
        <UnitsListItem
          name="Bitcoin"
          type="btc"
          selectedUnit={store.settings.unit}
          onSelect={() => setting.setBitcoinUnit({ unit: 'btc' })}
        />
      </MainContent>
    </Background>
  );
};

BitcoinUnitsView.propTypes = {
  store: PropTypes.object.isRequired,
  setting: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

//
// Units List Item
//

const iStyles = StyleSheet.create({
  item: {
    alignSelf: 'center',
    width: 500,
    height: 60,
    paddingLeft: 0,
    paddingRight: 0,
  },
  name: {
    flex: 1,
    color: color.grey,
  },
});

const UnitsListItem = ({ name, type, onSelect, selectedUnit }) => (
  <ListItem style={iStyles.item} onSelect={onSelect}>
    <Text style={iStyles.name}>{name}</Text>
    <RadioButton selected={type === selectedUnit} />
  </ListItem>
);

UnitsListItem.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedUnit: PropTypes.string.isRequired,
};

export default observer(BitcoinUnitsView);
