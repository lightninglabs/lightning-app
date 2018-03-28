import * as log from './logs';
import { NOTIFICATION_DELAY } from '../config';

class NotificationAction {
  constructor(store) {
    this._store = store;
  }

  display({ type, msg, err, handler, handlerLbl }) {
    if (err) log.error(msg, err);
    this._store.notifications.push({
      type: type || (err ? 'error' : 'info'),
      message: msg,
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

export default NotificationAction;
