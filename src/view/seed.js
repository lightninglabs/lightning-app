import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import MainContent from '../component/main-content';
import { CopyText, H1Text, Text } from '../component/text';
import { SplitBackground } from '../component/background';
import { GlasButton } from '../component/button';
import { color, font } from '../component/style';

const styles = StyleSheet.create({
  splitTop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    padding: 20,
    fontSize: font.sizeXXL,
    textAlign: 'center',
  },
  copyTxt: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: font.sizeL,
    lineHeight: font.lineHeightL,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    maxWidth: 600,
  },
  wordList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 20,
  },
  wordWrapper: {
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
    marginLeft: 10,
  },
});

const SeedView = ({ store }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <View style={styles.splitTop}>
      <H1Text style={styles.title}>First, write down your seed</H1Text>
      <CopyText style={styles.copyTxt}>
        A seed is a group of words that will help you to recover your wallet if
        you lose your password or computer. Write it down, and keep it in a safe
        place.
      </CopyText>
    </View>
    <MainContent>
      <View style={styles.wordList}>
        {store.seedMnemonic
          .slice()
          .map((word, ind) => <Word word={word} key={ind + 1} />)}
      </View>
      <GlasButton onPress={() => {}}>Next</GlasButton>
    </MainContent>
  </SplitBackground>
);

SeedView.propTypes = {
  store: PropTypes.object.isRequired,
};

const Word = ({ word, key }) => (
  <View style={styles.wordWrapper}>
    <Text style={styles.word}>
      {key}. {word}
    </Text>
  </View>
);

Word.propTypes = {
  word: PropTypes.string,
  key: PropTypes.number,
};

export default observer(SeedView);
