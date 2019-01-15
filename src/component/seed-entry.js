import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '../component/text';
import { InputField } from '../component/field';
import { createStyles, maxWidth } from '../component/media-query';
import { color, font, breakWidth } from '../component/style';

//
// Seed Entry
//

const baseStyles = {
  wrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    borderBottomColor: color.greyText,
    borderBottomWidth: 1,
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
};

const styles = createStyles(
  baseStyles,

  maxWidth(breakWidth, {
    wrapper: {
      marginTop: 20,
    },
    input: {
      height: font.lineHeightM + 2 * 6,
    },
  })
);

const SeedEntry = ({ seedIndex, ...props }) => (
  <View style={styles.wrapper}>
    <Text style={styles.index}>{seedIndex}.</Text>
    <InputField style={styles.input} {...props} />
  </View>
);

SeedEntry.propTypes = {
  seedIndex: PropTypes.number,
};

export default SeedEntry;
