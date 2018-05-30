import React, { Component } from 'react';
import {
  View,
  ListView,
  TouchableOpacity,
  ViewPropTypes,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { color } from './style';

//
// List Content
//

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 50,
    paddingRight: 50,
  },
});

export const ListContent = ({ children, style }) => (
  <View style={[styles.content, style]}>{children}</View>
);

ListContent.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
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
        dataSource={this.dataSource}
        renderHeader={this.props.renderHeader}
        renderRow={this.props.renderItem}
        enableEmptySections={true}
        horizontal={this.props.horizontal}
        contentContainerStyle={this.props.contentStyle}
        initialListSize={this.props.initialListSize}
      />
    );
  }
}

List.propTypes = {
  data: PropTypes.array.isRequired,
  renderHeader: PropTypes.func,
  renderItem: PropTypes.func.isRequired,
  horizontal: PropTypes.bool,
  contentStyle: ViewPropTypes.style,
  initialListSize: PropTypes.number,
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
    paddingLeft: 10,
    paddingRight: 10,
    boxShadow: `0 0.5px ${color.greyBorder}`,
  },
});

export const ListItem = ({ onSelect, children, style }) =>
  onSelect ? (
    <TouchableOpacity onPress={onSelect} style={[itemStyles.item, style]}>
      {children}
    </TouchableOpacity>
  ) : (
    <View style={[itemStyles.item, style]}>{children}</View>
  );

ListItem.propTypes = {
  onSelect: PropTypes.func,
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

//
// List Header
//

const headStyles = StyleSheet.create({
  head: {
    boxShadow: '0',
  },
});

export const ListHeader = ({ style, children }) => (
  <View style={[itemStyles.item, headStyles.head, style]}>{children}</View>
);

ListHeader.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
};
