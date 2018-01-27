import { observe } from 'mobx';
import { PREFIX_URI } from '../config';

class ActionsPayments {
  constructor(store, actionsGrpc, actionsWallet) {
    this._store = store;
    this._actionsGrpc = actionsGrpc;
    this._actionsWallet = actionsWallet;
    observe(this._store, 'lndReady', () => {});
  }

  makePayment({ payment, amount }) {
    return new Promise((resolve, reject) => {
      this.decodePaymentRequest(payment)
        .then(() => {
          this.payLightning(payment)
            .then(resolve)
            .catch(reject);
        })
        .catch(err => {
          console.log('ActionsPayments makePayment', err);
          // Pay to coin
          this.sendCoins({
            addr: payment,
            amount,
          })
            .then(resolve)
            .catch(reject);
        });
    });
  }

  sendCoins({ addr, amount }) {
    // Send to coin address
    return new Promise((resolve, reject) => {
      return this._actionsGrpc
        .sendCommand('sendCoins', {
          addr,
          amount,
        })
        .then(() => {
          this._actionsWallet.updateBalances();
          resolve();
        })
        .catch(reject);
    });
  }

  payLightning(payment) {
    return new Promise((resolve, reject) => {
      payment = payment.replace(PREFIX_URI, ''); // Remove URI prefix if it exists
      this._actionsGrpc
        .sendStreamCommand('sendPayment')
        .then(payments => {
          payments.on('data', data => {
            if (data.payment_error === '') {
              resolve();
            } else {
              reject(new Error('Payment route failure'));
            }
          });
          payments.on('error', reject);
          payments.write({ payment_request: payment });
        })
        .catch(reject);
    });
  }

  decodePaymentRequest(paymentRequest) {
    // Check if lightning address
    return new Promise((resolve, reject) => {
      paymentRequest = paymentRequest.replace(PREFIX_URI, ''); // Remove URI prefix if it exists
      this._actionsGrpc
        .sendCommand('decodePayReq', {
          pay_req: paymentRequest,
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export default ActionsPayments;
