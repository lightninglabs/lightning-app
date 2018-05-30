import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { H1Text, Text } from '../component/text';
import { GlasButton } from '../component/button';
import { InputField } from '../component/field';
import Card from '../component/card';
import { FormStretcher } from '../component/form';
import { color, font } from '../component/style';
import { formatOrdinal } from '../helper';

const styles = StyleSheet.create({
  content: {
    alignItems: 'stretch',
  },
  background: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    flex: 1,
    justifyContent: 'flex-end',
    textAlign: 'center',
    fontSize: font.sizeXXL,
    padding: 20,
  },
  card: {
    maxHeight: 450,
    maxWidth: 680,
    paddingTop: 38,
  },
  description: {
    color: color.greyText,
    fontSize: font.sizeM,
  },
  entry: {
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignSelf: 'stretch',
    paddingTop: 50,
    paddingBottom: 20,
    maxWidth: 553,
    borderBottomColor: color.greyText,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leaderTxt: {
    alignSelf: 'center',
    color: color.greyText,
    borderBottomColor: color.greyText,
    fontSize: font.sizeL,
    lineHeight: font.lineHeightL,
    width: 35,
  },
  input: {
    flex: 8,
    alignSelf: 'center',
    borderBottomWidth: 0,
    textAlign: 'left',
    fontSize: font.sizeL,
    lineHeight: font.lineHeightL,
  },
});

const SeedVerifyView = ({ seedCheck }) => (
  <MainContent style={styles.content}>
    <Background image="purple-gradient-bg" style={styles.background}>
      <View>
        <H1Text style={styles.title}>{"Let's double check"}</H1Text>
      </View>
      <Card style={styles.card}>
        <Text style={styles.description}>
          Type the {formatOrdinal(seedCheck[0])}, {formatOrdinal(seedCheck[1])},
          and {formatOrdinal(seedCheck[2])} words of your seed.
        </Text>
        <SeedEntry leaderText={seedCheck[0]} />
        <SeedEntry leaderText={seedCheck[1]} />
        <SeedEntry leaderText={seedCheck[2]} />
      </Card>
      <GlasButton>Next</GlasButton>
    </Background>
  </MainContent>
);

SeedVerifyView.propTypes = {
  seedCheck: PropTypes.array,
};

const SeedEntry = ({ leaderText }) => (
  <FormStretcher style={styles.entry}>
    <Text style={styles.leaderTxt}>{leaderText}.</Text>
    <InputField style={styles.input} onChangeText={() => {}} />
  </FormStretcher>
);

SeedEntry.propTypes = {
  leaderText: PropTypes.string,
};

export default observer(SeedVerifyView);
