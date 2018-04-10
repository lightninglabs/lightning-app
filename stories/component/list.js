import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Text from '../../src/component/text';
import {
  ListContent,
  List,
  ListItem,
  ListHeader,
} from '../../src/component/list';
import { colors } from '../../src/component/style';

storiesOf('List', module).add('List Content', () => (
  <ListContent>
    <List
      data={[...Array(1000)].map((x, i) => ({ id: String(i), data: 'foo' }))}
      renderHeader={() => (
        <ListHeader>
          <Text style={{ flex: 1, color: colors.greyText }}>ID</Text>
          <Text style={{ flex: 1, color: colors.greyText }}>Data</Text>
        </ListHeader>
      )}
      renderItem={item => (
        <ListItem onSelect={action('select')}>
          <Text style={{ flex: 1, color: colors.blackText }}>{item.id}</Text>
          <Text style={{ flex: 1, color: colors.blackText }}>{item.data}</Text>
        </ListItem>
      )}
    />
  </ListContent>
));
