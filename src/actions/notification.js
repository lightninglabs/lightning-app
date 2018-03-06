import * as log from './logs';
import { NOTIFICATION_DELAY } from '../config';

class ActionsNotification {
  constructor(store) {
    this._store = store;
  }

  display({ type = 'info', message, error, handler, handlerLbl }) {
    if (error) log.error(message, error);
    this._store.notifications.push({
      type,
      message,
      handler,
      handlerLbl,
      display: true,
    });
    clearTimeout(this.tdisplay);
    this.tdisplay = setTimeout(() => this.close(), NOTIFICATION_DELAY);
  }

  close() {
    this._store.notifications.forEach(n => {
      n.display = false;
    });
  }
}

export default ActionsNotification;
