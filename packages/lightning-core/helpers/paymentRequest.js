const prefix = 'lightning://'

export const decoratePaymentRequest = (pr) => {
  return prefix + pr
}

export const sanitizePaymentRequest = (pr) => {
  return pr.replace(prefix, '')
}
