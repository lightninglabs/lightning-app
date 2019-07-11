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
  left: {
    flex: 1,
  },
  name: {
    color: color.grey,
    fontSize: font.sizeSub,
  },
  copy: {
    width: '80%',
    fontSize: font.sizeS,
    lineHeight: font.lineHeightS,
    color: color.greyListLabel,
    opacity: 0.74,
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

export const SettingItem = ({
  name,
  copy,
  onSelect,
  label,
  arrow,
  children,
}) => (
  <ListItem
    style={[iStyles.item, copy ? { height: 80 } : null]}
    onSelect={onSelect}
  >
    <View style={iStyles.left}>
      <Text style={iStyles.name}>{name}</Text>
      {copy ? <Text style={iStyles.copy}>{copy}</Text> : null}
    </View>
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
  copy: PropTypes.string,
  onSelect: PropTypes.func,
  label: PropTypes.string,
  arrow: PropTypes.bool,
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
