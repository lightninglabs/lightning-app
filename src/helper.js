export const formatNumber = val => {
  let num = Number(val);
  if (isNaN(num)) {
    num = 0;
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 8 });
};

export const formatFiat = (val, currency) => {
  let num = Number(val);
  if (isNaN(num)) {
    num = 0;
  }
  return num.toLocaleString(undefined, { style: 'currency', currency });
};

export const toHash = hash => new Buffer(hash, 'base64').toString('hex');

export const reverse = src => {
  const buffer = new Buffer(src.length);
  for (var i = 0, j = src.length - 1; i <= j; ++i, --j) {
    buffer[i] = src[j];
    buffer[j] = src[i];
  }
  return buffer;
};
