/**
 * @fileOverview actions to display notifications to the user in case something
 * relevant happens or an error occurs. Notifications are display in the notification
 * bar at the top of the screen for a brief time and can be listed in the notification
 * view later.
 */

import * as log from './log';
import { NOTIFICATION_DELAY } from '../config';

class NotificationAction {
  constructor(store, nav) {
    this._store = store;
    this._nav = nav;
  }

  /**
   * Set the dropdown component used on mobile.
   * @param {Object} dropdown The component reference
   */
  setDropdown(dropdown) {
    this._dropdown = dropdown;
  }

  /**
   * The main api used to display notifications thorughout the application. Several
   * types of notifications can be displayed including `info` `error` or `success`.
   * If the wait flag is set the notification bar will display a spinner e.g. when
   * something is loading. If an error is provided that will be logged to the cli.
   * Also an action handler can be passed which will render a button e.g. for error
   * resolution. A notification is displayed for a few seconds.
   * @param  {string}   options.type       Either `info` `error` or `success`
   * @param  {string}   options.msg        The notification message
   * @param  {boolean}  options.wait       If a spinner should be displayed
   * @param  {Error}    options.err        The error object to be logged
   * @param  {Function} options.handler    Called when the button is pressed
   * @param  {string}   options.handlerLbl The action handler button text
   * @return {undefined}
   */
  display({ type, msg, wait, err, handler, handlerLbl }) {
    if (err) log.info(msg, err);
    this._store.notifications.push({
      type: type || (err ? 'error' : 'info'),
      message: msg,
      waiting: wait,
      date: new Date(),
      handler: handler || (err ? () => this._nav.goCLI() : null),
      handlerLbl: handlerLbl || (err ? 'Show error logs' : null),
      display: true,
    });
    if (!wait) this._store.unseenNtfnCount += 1;
    clearTimeout(this.tdisplay);
    this.tdisplay = setTimeout(() => this.close(), NOTIFICATION_DELAY);
    // render dropdown on mobile
    if (this._dropdown) {
      this._dropdown.alertWithType('custom', '', msg);
    }
  }

  /**
   * Called after the notification bar display time has run out to stop rendering
   * the notification in the notification bar.
   * @return {undefined}
   */
  close() {
    this._store.notifications.forEach(n => {
      n.display = false;
    });
  }
}

export default NotificationAction;
