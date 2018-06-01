import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { NotificationBar } from '../../src/component/notification';
import NotificationAction from '../../src/action/notification';
import { Store } from '../../src/store';

const store = new Store();
export const notify = new NotificationAction(store);

storiesOf('Notification', module).add('Notification Bar', () => (
  <NotificationBar
    notification={store.lastNotification}
    display={store.displayNotification}
  />
));

store.notifications.push({
  type: 'error',
  message: 'Oops something went wrong',
  handler: action('handle_error'),
  handlerLbl: 'Handle error',
  display: true,
});
