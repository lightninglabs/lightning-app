import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { CopyText, H1Text, Text } from '../component/text';
import { SplitBackground } from '../component/background';
import { GlasButton } from '../component/button';
import { List } from '../component/list';
import { color } from '../component/style';

const styles = StyleSheet.create({
  split: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 53,
    marginBottom: 20,
    textAlign: 'center',
  },
  copyTxt: {
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 33,
    maxWidth: 600,
  },
  wordList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 25,
    minHeight: 310,
    maxWidth: 1075,
  },
  wordWrapper: {
    height: 55,
    width: 152,
    margin: 12,
    borderWidth: 1,
    borderColor: 'rgba(151,151,151,0.26)',
    backgroundColor: 'rgba(130,129,129,0.09)',
  },
  word: {
    fontSize: 17,
    marginLeft: 10,
    lineHeight: 50,
  },
});

const SeedView = ({ store }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <View style={styles.split}>
      <H1Text style={styles.title}>First, write down your seed</H1Text>
      <CopyText style={styles.copyTxt}>
        A seed is a group of words that will help you to recover your wallet if
        you lose your password or computer. Write it down, and keep it in a safe
        place.
      </CopyText>
    </View>
    <View style={styles.split}>
      <List
        data={store.seed}
        renderItem={(word, _, rowID) => (
          <Word word={word} ind={parseInt(rowID) + 1} />
        )}
        horizontal={true}
        contentStyle={styles.wordList}
        initialListSize={24}
      />
      <GlasButton onPress={() => {}}>Next</GlasButton>
    </View>
  </SplitBackground>
);

SeedView.propTypes = {
  store: PropTypes.object.isRequired,
};

const Word = ({ word, ind }) => (
  <View style={styles.wordWrapper}>
    <Text style={styles.word}>
      {ind}. {word}
    </Text>
  </View>
);

Word.propTypes = {
  word: PropTypes.string,
  ind: PropTypes.number,
};

export default observer(SeedView);
