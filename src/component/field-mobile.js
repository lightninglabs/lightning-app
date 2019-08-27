import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import PropTypes from 'prop-types';
import Text from './text';
import ArrowDownIcon from '../asset/icon/arrow-down';
import { color, font } from './style';

//
// Named Field Select
//

const namedSelectStyles = StyleSheet.create({
  content: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: color.blackText,
    borderBottomWidth: 1,
  },
  name: {
    color: color.blackText,
    fontSize: font.sizeM,
    lineHeight: font.lineHeightM + 2 * 12,
    marginRight: 15,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontFamily: 'OpenSans Regular',
    fontSize: font.sizeM,
    lineHeight: font.lineHeightM + 3,
    height: font.lineHeightM + 2 * 12,
    color: color.blackText,
    opacity: 0.75,
  },
  inputAndroid: {
    fontFamily: 'OpenSans Regular',
    fontSize: font.sizeM,
    lineHeight: font.lineHeightM + 3,
    height: font.lineHeightM + 2 * 12,
    color: color.blackText,
    opacity: 0.75,
    padding: 0,
  },
});

export const NamedFieldSelect = ({ name, style, ...props }) => (
  <View style={[namedSelectStyles.content, style]}>
    <Text style={namedSelectStyles.name}>{name}</Text>
    <View style={namedSelectStyles.wrapper}>
      <RNPickerSelect placeholder={{}} style={pickerStyles} {...props} />
      <ArrowDownIcon height={22} width={22} stroke="#969596" />
    </View>
  </View>
);

NamedFieldSelect.propTypes = {
  name: PropTypes.string,
  style: ViewPropTypes.style,
};
