import React, { Component } from 'react';
import { View, ListView, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from './style';

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
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows(props.data),
    };
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={this.props.renderHeader}
        renderRow={this.props.renderItem}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    boxShadow: `0 0.5px ${colors.greyBorder}`,
  },
});

export const ListItem = ({ children, style }) => (
  <View style={[itemStyles.item, style]}>{children}</View>
);

ListItem.propTypes = {
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
