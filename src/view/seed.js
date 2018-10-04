import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import MainContent from '../component/main-content';
import { CopyText, H1Text, Text } from '../component/text';
import { SplitBackground } from '../component/background';
import { GlasButton } from '../component/button';
import { color, font } from '../component/style';

//
// Seed View
//

const styles = StyleSheet.create({
  content: {
    flexBasis: 0,
  },
});

const SeedView = ({ store, wallet }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <CopySection />
    <MainContent style={styles.content}>
      <WordList seedMnemonic={store.seedMnemonic.slice()} />
      <GlasButton onPress={() => wallet.initSeedVerify()}>Next</GlasButton>
    </MainContent>
  </SplitBackground>
);

SeedView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

//
// Copy Section
//

const copyStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 15,
    maxWidth: 450,
  },
});

const CopySection = () => (
  <View style={copyStyles.wrapper}>
    <H1Text style={copyStyles.title}>
      {'First, write down your\nrecovery phrase'}
    </H1Text>
    <CopyText style={copyStyles.copyTxt}>
      A recovery phrase is a group of words that will help you to recover your
      wallet if you lose your password or computer. Write it down, and keep it
      in a safe place.
    </CopyText>
  </View>
);

//
// Word List
//

const listStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    margin: 20,
  },
  words: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 700,
  },
});

const WordList = ({ seedMnemonic }) => (
  <View style={listStyles.wrapper}>
    <View style={listStyles.words}>
      {seedMnemonic.map((word, i) => (
        <Word word={word} index={i + 1} key={i} />
      ))}
    </View>
  </View>
);

WordList.propTypes = {
  seedMnemonic: PropTypes.array.isRequired,
};

//
// Word
//

const wordStyles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    height: 35,
    width: 100,
    margin: 5,
    borderWidth: 1,
    borderColor: color.seedBorder,
    backgroundColor: color.seedBackground,
  },
  word: {
    fontSize: font.sizeS,
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
