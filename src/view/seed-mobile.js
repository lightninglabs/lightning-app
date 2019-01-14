import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import MainContent from '../component/main-content';
import { Text } from '../component/text';
import { SplitBackground } from '../component/background';
import { Header, LargeTitle } from '../component/header';
import { Button, BackButton, SmallGlasButton } from '../component/button';
import SeedIcon from '../asset/icon/seed';
import { color, font } from '../component/style';

//
// Seed (Mobile) View
//

const styles = StyleSheet.create({
  backBtn: {
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  content: {
    justifyContent: 'center',
    backgroundColor: color.blackDark,
  },
  pagination: {
    marginBottom: 10,
  },
});

const SeedView = ({ store, wallet }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <Header>
      <BackButton
        style={styles.backBtn}
        onPress={() => wallet.initPrevSeedPage()}
      />
      <LargeTitle title="Write down each word and store it in a safe place.">
        <SeedIcon height={44} width={37} />
      </LargeTitle>
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent style={styles.content}>
      <WordList
        startingIndex={store.wallet.seedIndex}
        seedMnemonic={store.seedMnemonic.slice(
          store.wallet.seedIndex,
          store.wallet.seedIndex + 8
        )}
      />
      <Text style={styles.pagination}>
        {`${store.wallet.seedIndex + 8} of 24`}
      </Text>
    </MainContent>
    <SmallGlasButton onPress={() => wallet.initNextSeedPage()}>
      Next
    </SmallGlasButton>
  </SplitBackground>
);

SeedView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

//
// Word List
//

const listStyles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    maxWidth: 350,
    margin: 20,
  },
  words: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

const WordList = ({ seedMnemonic, startingIndex }) => (
  <View style={listStyles.wrapper}>
    <View style={listStyles.words}>
      {seedMnemonic.map((word, i) => (
        <Word word={word} index={startingIndex + i + 1} key={i} />
      ))}
    </View>
  </View>
);

WordList.propTypes = {
  seedMnemonic: PropTypes.array.isRequired,
  startingIndex: PropTypes.number,
};

//
// Word
//

const wordStyles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    height: 45,
    width: 115,
    margin: 8,
    borderWidth: 1,
    borderColor: color.seedBorder,
    backgroundColor: color.seedBackground,
  },
  word: {
    fontSize: font.sizeS * 1.2,
    paddingLeft: 10,
  },
});

const Word = ({ word, index }) => (
  <View style={wordStyles.wrapper}>
    <Text style={wordStyles.word}>
      {index}. {word}
    </Text>
  </View>
);

Word.propTypes = {
  word: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default observer(SeedView);
