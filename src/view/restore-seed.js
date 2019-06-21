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
// Restore Wallet Seed View
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

const RestoreSeedView = ({ store, wallet }) => (
  <Background image="purple-gradient-bg">
    <Header>
      <BackButton onPress={() => wallet.initPrevRestorePage()} />
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent style={styles.content}>
      <View>
        <H1Text style={styles.title}>Restore your wallet</H1Text>
      </View>
      <Card style={styles.card}>
        <FormSubText>{store.restoreVerifyCopy}</FormSubText>
        {store.restoreVerifyIndexes.map((seedIndex, i) => (
          <SeedEntry
            seedIndex={seedIndex}
            value={store.restoreSeedMnemonic[seedIndex - 1]}
            onChangeText={word =>
              wallet.setRestoreSeed({ word, index: seedIndex - 1 })
            }
            key={i}
            autoFocus={seedIndex - 1 === store.wallet.focusedRestoreInd}
            onSubmitEditing={() =>
              i === 2
                ? wallet.initNextRestorePage()
                : wallet.setFocusedRestoreInd({ index: seedIndex })
            }
            onClick={() =>
              wallet.setFocusedRestoreInd({ index: seedIndex - 1 })
            }
          />
        ))}
      </Card>
      <GlasButton onPress={() => wallet.initNextRestorePage()}>Next</GlasButton>
    </MainContent>
  </Background>
);

RestoreSeedView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

export default observer(RestoreSeedView);
