export const formatNumber = val => {
  const num = Number(val);
  if (isNaN(num)) {
    return '';
  } else {
    return `${num.toLocaleString()}`;
  }
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
