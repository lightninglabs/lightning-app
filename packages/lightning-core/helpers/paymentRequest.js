const prefix = 'lightning:'

export const decoratePaymentRequest = (pr) => {
  return prefix + pr
}

// Payment requests should start with either lightning: or lightning://
export const sanitizePaymentRequest = (pr) => {
  return pr.replace(/lightning:(\/\/)?/g, '')
}
