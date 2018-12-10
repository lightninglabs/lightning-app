/**
 * @fileOverview computed values that are used in transaction UI components.
 */

import { extendObservable } from 'mobx';
import { toAmountLabel, toCaps } from '../helper';
import { UNITS } from '../config';

const ComputedTransaction = store => {
  extendObservable(store, {
    get computedTransactions() {
      const { transactions, payments, invoices, settings } = store;
      const t = transactions ? transactions.slice() : [];
      const p = payments ? payments.slice() : [];
      const i = invoices ? invoices.slice() : [];
      const all = [].concat(t, p, i);
      all.sort((a, b) => b.date.getTime() - a.date.getTime());
      all.forEach(t => {
        t.idName = t.type === 'bitcoin' ? 'Transaction ID' : 'Invoice ID';
        t.typeLabel = toCaps(t.type);
        t.statusLabel = toCaps(t.status);
        t.dateLabel = t.date.toLocaleDateString();
        t.dateTimeLabel = t.date.toLocaleString();
        t.amountLabel = toAmountLabel(t.amount, settings);
        t.unitAmountLbl = `${toAmountLabel(t.amount, settings)}${
          store.settings.displayFiat
            ? ''
            : ' ' + UNITS[store.settings.unit].display
        }`;
        t.feeLabel = toAmountLabel(t.fee || 0, settings);
        t.unitFeeLbl = `${toAmountLabel(t.fee || 0, settings)}${
          store.settings.displayFiat
            ? ''
            : ' ' + UNITS[store.settings.unit].display
        }`;
        if (Number.isInteger(t.confirmations)) {
          t.confirmationsLabel = t.confirmations.toString();
        }
      });
      return all.slice(0, 100);
    },
  });
};

export default ComputedTransaction;
