import React from 'react';
import { View, ScrollView, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import { ListItem, ListHeader } from './list';
import ForwardIcon from '../asset/icon/forward';
import { createStyles, maxWidth } from './media-query';
import { color, font, breakWidth } from './style';

//
// Setting Content
//

const baseCStyles = {
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 25,
    paddingLeft: 50,
    paddingRight: 50,
  },
};

const cStyles = createStyles(
  baseCStyles,

  maxWidth(breakWidth, {
    content: {
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      paddingTop: 50,
      paddingBottom: 0,
      paddingLeft: 20,
      paddingRight: 20,
    },
  })
);

export const SettingContent = ({ children, style }) => (
  <ScrollView contentContainerStyle={[cStyles.content, style]}>
    {children}
  </ScrollView>
);

SettingContent.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

//
// Setting List
//

const baseLStyles = {
  list: {
    width: 400,
  },
};

const lStyles = createStyles(
  baseLStyles,

  maxWidth(breakWidth, {
    list: {
      width: undefined,
    },
  })
);

export const SettingList = ({ children, style }) => (
  <View style={[lStyles.list, style]}>{children}</View>
);

SettingList.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

//
// Setting Item
//

const iStyles = StyleSheet.create({
  item: {
    height: 60,
  },
  name: {
    flex: 1,
    color: color.grey,
    fontSize: font.sizeSub,
  },
  lbl: {
    fontSize: font.sizeS,
    color: color.greyListLabel,
    opacity: 0.74,
  },
  iconWrapper: {
    marginLeft: 20,
  },
});

export const SettingItem = ({ name, onSelect, label, arrow, children }) => (
  <ListItem style={iStyles.item} onSelect={onSelect}>
    <Text style={iStyles.name}>{name}</Text>
    {label ? <Text style={iStyles.lbl}>{label}</Text> : null}
    {children}
    {arrow ? (
      <View style={iStyles.iconWrapper}>
        <ForwardIcon height={13.5} width={8.1} />
      </View>
    ) : null}
  </ListItem>
);

SettingItem.propTypes = {
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  label: PropTypes.string,
  arrow: PropTypes.bool,
  children: PropTypes.node,
};

//
// Setting Copy Item
//

const iCopyStyles = StyleSheet.create({
  item: {
    height: null,
    paddingTop: 20,
    paddingBottom: 20,
  },
  left: {
    flex: 1,
  },
  name: {
    color: color.grey,
    fontSize: font.sizeSub,
  },
  copy: {
    fontSize: font.sizeS,
    lineHeight: font.lineHeightS,
    color: color.greyListLabel,
    opacity: 0.74,
    paddingRight: 50,
    marginTop: 5,
  },
});

export const SettingCopyItem = ({ name, onSelect, copy, children }) => (
  <ListItem style={iCopyStyles.item} onSelect={onSelect}>
    <View style={iCopyStyles.left}>
      <Text style={iCopyStyles.name}>{name}</Text>
      <Text style={iCopyStyles.copy}>{copy}</Text>
    </View>
    {children}
  </ListItem>
);

SettingCopyItem.propTypes = {
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  copy: PropTypes.string,
  children: PropTypes.node,
};

//
// Setting Header
//

const hStyles = StyleSheet.create({
  header: {
    height: 20,
  },
  txt: {
    fontFamily: 'OpenSans SemiBold',
    color: color.greyListHeader,
    fontSize: font.sizeXS,
  },
});

export const SettingHeader = ({ name, style }) => (
  <ListHeader style={[hStyles.header, style]}>
    <Text style={[iStyles.i, hStyles.txt]}>{name}</Text>
  </ListHeader>
);

SettingHeader.propTypes = {
  name: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};
