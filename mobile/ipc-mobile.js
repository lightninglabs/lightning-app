import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  NativeModules,
  NativeEventEmitter
} from 'react-native';

var base64 = require('base64-js');
var lnrpc = require('./rpc_pb');
var Lnd = NativeModules.LndReactModule;

/**
 * @fileOverview a low level action to wrap electron's IPC renderer api.
 */

class IpcAction {
  constructor(ipcRenderer) {
    this._ipcRenderer = ipcRenderer;
  }

  /**
   * A wrapper around electron's ipcRenderer send api that can be
   * reused wherever IPC to the main process is necessary.
   * @param  {string} event   The event name the main process listens to
   * @param  {string} listen  (optional) The response event name this process listens to
   * @param  {*}      payload The data sent over IPC
   * @return {Promise<Object>}
   */
  send(event, listen, payload) {
    const events = new NativeEventEmitter(Lnd);
    const subscription = events.addListener(
        'SendResponse',
        (resp) => {
            if (resp.error) {
                console.log("Got stream error", resp.error)
                subscription.remove();
                return
            }

            var p = lnrpc.SendResponse.deserializeBinary(base64.toByteArray(resp.resp))
            console.log("callback object", p.toObject())
        }
    );

    var msg = new lnrpc.SendRequest()
    msg.setAmt(1234)
    var b64 = base64.fromByteArray(msg.serializeBinary())
    Lnd.sendPayment(b64);

//    var msg = new lnrpc.GetInfoRequest()
//    var b64 = base64.fromByteArray(msg.serializeBinary())
//    Lnd.getInfo(b64, (error, resp) => {
//         if (error) {
//            console.error("callback error", error);
//         } else {
//             var p = lnrpc.GetInfoResponse.deserializeBinary(base64.toByteArray(resp))
//             console.log("callback object", p.toObject())
//         }
//    });
//
//    return new Promise((resolve, reject) => {
//      this._ipcRenderer.send(event, payload);
//      if (!listen) return resolve();
//      this._ipcRenderer.once(listen, (e, arg) => {
//        if (arg.err) {
//          reject(arg.err);
//        } else {
//          resolve(arg.response);
//        }
//      });
//    });
  }

  /**
   * A wrapper around electron's ipcRenderer listen api that can be
   * reused wherever listening to IPC from the main process is necessary.
   * @param  {string}   event    The event name this process listens to
   * @param  {Function} callback The event handler for incoming data
   * @return {undefined}
   */
  listen(event, callback) {
    this._ipcRenderer.on(event, callback);
  }
}

export default IpcAction;
