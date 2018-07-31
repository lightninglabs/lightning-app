import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '../component/text';
import { InputField } from '../component/field';
import { color, font } from '../component/style';

//
// Seed Entry
//

const entryStyles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    borderBottomColor: color.greyText,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  index: {
    color: color.greyText,
    fontSize: font.sizeM,
    lineHeight: font.lineHeightM,
    width: 35,
  },
  input: {
    flex: 1,
    textAlign: 'left',
    borderBottomWidth: 0,
  },
});

const SeedEntry = ({ seedIndex, ...props }) => (
  <View style={entryStyles.wrapper}>
    <Text style={entryStyles.index}>{seedIndex}.</Text>
    <InputField style={entryStyles.input} {...props} />
  </View>
);

SeedEntry.propTypes = {
  seedIndex: PropTypes.number,
};

export default SeedEntry;
