import * as log from './logs';

class ActionsNotification {
  constructor(store) {
    this._store = store;
  }

  display({ type = 'info', message, error, handler, handlerLbl }) {
    if (error) log.error(message, error);
    this._store.notification = {
      type,
      message,
      handler,
      handlerLbl,
    };
  }

  close() {
    this._store.notification = null;
  }
}

export default ActionsNotification;
