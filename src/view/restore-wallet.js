import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import SeedEntry from '../component/seed-entry';
import { Button, BackButton, GlasButton } from '../component/button';
import { H1Text } from '../component/text';
import { FormSubText } from '../component/form';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { Header } from '../component/header';
import Card from '../component/card';

//
// Restore Wallet View
//

const styles = StyleSheet.create({
  content: {
    justifyContent: 'flex-end',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    maxHeight: 350,
    maxWidth: 680,
    paddingLeft: 45,
    paddingRight: 45,
    paddingBottom: 50,
  },
});

const RestoreWalletView = ({ store, nav, wallet }) => (
  <Background image="purple-gradient-bg">
    <Header>
      <BackButton onPress={() => nav.goSeed()} />
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent style={styles.content}>
      <View>
        <H1Text style={styles.title}>Restore your wallet</H1Text>
      </View>
      <Card style={styles.card}>
        <FormSubText>{store.seedVerifyCopy}</FormSubText>
        {store.seedVerifyIndexes.map((seedIndex, i) => (
          <SeedEntry
            seedIndex={seedIndex}
            value={store.wallet.seedVerify[i]}
            onChangeText={word => wallet.setSeedVerify({ word, index: i })}
            key={i}
            autoFocus={i === 0}
            onSubmitEditing={() => wallet.checkSeed()}
          />
        ))}
      </Card>
      <GlasButton onPress={() => wallet.checkSeed()}>Next</GlasButton>
    </MainContent>
  </Background>
);

RestoreWalletView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

export default observer(RestoreWalletView);
