import React, { Component, PureComponent } from 'react';
import { View, ListView, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import ForwardIcon from '../asset/icon/forward';
import { createStyles, maxWidth } from './media-query';
import { color, font, breakWidth } from './style';

//
// List Content
//

const baseStyles = {
  content: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 50,
    paddingRight: 50,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(breakWidth, {
    content: {
      paddingTop: 10,
      paddingBottom: 0,
      paddingLeft: 10,
      paddingRight: 10,
    },
  })
);

export const ListContent = ({ children, style }) => (
  <View style={[styles.content, style]}>{children}</View>
);

ListContent.propTypes = {
  children: PropTypes.node,
  style: View.propTypes.style,
};

//
// List
//

export class List extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
  }

  get dataSource() {
    return this.ds.cloneWithRows(this.props.data);
  }

  render() {
    return (
      <ListView
        ref={component => (this.list = component)}
        dataSource={this.dataSource}
        renderHeader={this.props.renderHeader}
        stickyHeaderIndices={this.props.renderHeader ? [0] : []}
        renderRow={this.props.renderItem}
        enableEmptySections={true}
      />
    );
  }
}

List.propTypes = {
  data: PropTypes.array.isRequired,
  renderHeader: PropTypes.func,
  renderItem: PropTypes.func.isRequired,
};

//
// List Item
//

const itemStyles = StyleSheet.create({
  item: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.greyBorder,
  },
});

export class ListItem extends PureComponent {
  render() {
    const { onSelect, children, style } = this.props;
    return onSelect ? (
      <TouchableOpacity onPress={onSelect} style={[itemStyles.item, style]}>
        {children}
      </TouchableOpacity>
    ) : (
      <View style={[itemStyles.item, style]}>{children}</View>
    );
  }
}

ListItem.propTypes = {
  onSelect: PropTypes.func,
  children: PropTypes.node,
  style: View.propTypes.style,
};

//
// List Header
//

const headStyles = StyleSheet.create({
  head: {
    borderBottomWidth: 0,
  },
});

export const ListHeader = ({ style, children }) => (
  <View style={[itemStyles.item, headStyles.head, style]}>{children}</View>
);

ListHeader.propTypes = {
  children: PropTypes.node,
  style: View.propTypes.style,
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
  onSelect: PropTypes.func.isRequired,
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
  style: View.propTypes.style,
};
