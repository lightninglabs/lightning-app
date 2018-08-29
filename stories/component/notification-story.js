import React from 'react';
import { storiesOf } from '../storybook-react';
import { action } from '@storybook/addon-actions';
import { NotificationBar, CountBubble } from '../../src/component/notification';
import NotificationAction from '../../src/action/notification';
import { Store } from '../../src/store';

const store = new Store();
store.init();
export const notify = new NotificationAction(store);

storiesOf('Notification', module)
  .add('Notification Bar (error)', () => (
    <NotificationBar
      notification={store.notifications[0]}
      display={store.displayNotification}
    />
  ))
  .add('Notification Bar (waiting)', () => (
    <NotificationBar
      notification={store.notifications[1]}
      display={store.displayNotification}
    />
  ))
  .add('Count Bubble', () => (
    <CountBubble style={{ alignSelf: 'flex-start' }}>42</CountBubble>
  ))
  .add('Count Bubble (0)', () => (
    <CountBubble style={{ alignSelf: 'flex-start' }}>0</CountBubble>
  ));

store.notifications.push({
  type: 'error',
  message: 'Oops something went wrong',
  handler: action('handle_error'),
  handlerLbl: 'Handle error',
  display: true,
});
store.notifications.push({
  type: 'info',
  message: 'Syncing to chain',
  waiting: true,
  display: true,
});
