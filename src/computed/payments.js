import { computed, extendObservable } from 'mobx';

const ComputedPayments = store => {
  extendObservable(store, {
    computedPayment: computed(() => {
      const { paymentInfo, paymentRequestResponse } = store;
      let returnData;
      if (paymentRequestResponse.numSatoshis) {
        returnData = {
          amount: paymentRequestResponse.numSatoshis,
          description: paymentRequestResponse.description || null,
          isPaymentRequest: true,
        };
      } else {
        returnData = {
          amount: paymentInfo.amount
            ? String(paymentInfo.amount.replace(/\D/g, ''))
            : '',
          isPaymentRequest: false,
        };
      }
      returnData.payment = paymentInfo.payment;
      return returnData;
    }),
  });
};

export default ComputedPayments;
