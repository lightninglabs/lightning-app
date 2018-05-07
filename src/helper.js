import { UNITS } from './config';

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

export const toSatoshis = (amount, unit) => {
  if (typeof amount !== 'string' || !unit) throw new Error('Missing args!');
  return Math.round(Number(amount) * UNITS[unit].denominator);
};

export const toAmount = (satoshis, unit) => {
  if ((typeof satoshis !== 'number' && typeof satoshis !== 'string') || !unit) {
    throw new Error('Missing args!');
  }
  return formatNumber(parseInt(satoshis, 10) / UNITS[unit].denominator);
};

export const calculateExchangeRate = (satoshis, settings) => {
  if (typeof satoshis !== 'number') throw new Error('Missing args!');
  const rate = settings.exchangeRate[settings.fiat];
  const balance = satoshis / rate / UNITS.btc.denominator;
  return formatFiat(balance, settings.fiat);
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

export const checkHttpStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(response.statusText);
  }
};
