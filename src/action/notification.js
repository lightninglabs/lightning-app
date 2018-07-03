import * as log from './log';
import { NOTIFICATION_DELAY } from '../config';

class NotificationAction {
  constructor(store, nav) {
    this._store = store;
    this._nav = nav;
  }

  display({ type, msg, wait, err, handler, handlerLbl }) {
    if (err) log.error(msg, err);
    this._store.notifications.push({
      type: type || (err ? 'error' : 'info'),
      message: msg,
      waiting: wait,
      date: new Date(),
      handler: handler || (err ? () => this._nav.goCLI() : null),
      handlerLbl: handlerLbl || (err ? 'Show error logs' : null),
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
