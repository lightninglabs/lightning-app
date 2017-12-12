export const formatSatoshis = val => {
  const num = Number(val);
  if (isNaN(num)) {
    return '';
  } else {
    return `${num.toLocaleString()}`;
  }
};

export const toHash = hash => new Buffer(hash, 'base64').toString('hex');
