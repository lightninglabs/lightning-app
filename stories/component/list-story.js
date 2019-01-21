import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '../storybook-react';
import { action } from '@storybook/addon-actions';
import Text from '../../src/component/text';
import {
  ListContent,
  List,
  ListItem,
  ListHeader,
} from '../../src/component/list';
import { color } from '../../src/component/style';

storiesOf('List', module).add('List Content', () => (
  <ListContent>
    <List
      data={[...Array(1000)].map((x, i) => ({ key: String(i), data: 'foo' }))}
      renderHeader={() => (
        <ListHeader style={{ backgroundColor: color.white }}>
          <Text style={{ flex: 1, color: color.greyText }}>ID</Text>
          <Text style={{ flex: 1, color: color.greyText }}>Data</Text>
        </ListHeader>
      )}
      renderItem={item => <CustomListItem item={item} />}
    />
  </ListContent>
));

class CustomListItem extends PureComponent {
  render() {
    const { item } = this.props;
    return (
      <ListItem onSelect={action('select')}>
        <Text style={{ flex: 1, color: color.blackText }}>{item.key}</Text>
        <Text style={{ flex: 1, color: color.blackText }}>{item.data}</Text>
      </ListItem>
    );
  }
}

CustomListItem.propTypes = {
  item: PropTypes.object.isRequired,
};
