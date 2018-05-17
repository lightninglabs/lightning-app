import { UNITS } from './config';

/**
 * Format a number value in locale format with either . or ,
 * @param  {string|number} val The number value
 * @return {string}            The formatted number value
 */
export const formatNumber = val => {
  let num = Number(val);
  if (isNaN(num)) {
    num = 0;
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 8 });
};

/**
 * Format a fiat currency value in local format with currency symbol and either . or ,
 * @param  {string|number} val The number value
 * @param  {string} currency   The fiat currency e.g. 'usd'
 * @return {string}            The formatte fiat currency value
 */
export const formatFiat = (val, currency) => {
  let num = Number(val);
  if (isNaN(num)) {
    num = 0;
  }
  return num.toLocaleString(undefined, { style: 'currency', currency });
};

/**
 * Parse satoshi values to an integer number
 * @param  {string} satoshis The integer value as a string
 * @return {number}          The satoshi integer as a number
 */
export const parseSat = satoshis => {
  if (typeof satoshis !== 'string' || !/^[0-9]+$/.test(satoshis)) {
    throw new Error('Invalid input!');
  }
  satoshis = parseInt(satoshis, 10);
  if (isNaN(satoshis)) {
    throw new Error('Invalid input!');
  }
  return satoshis;
};

/**
 * Convert a string formatted BTC amount to satoshis
 * @param  {string} amount The amount e.g. '0.0001'
 * @param  {string} unit   The BTC unit e.g. 'btc' or 'bit'
 * @return {number}        The satoshis as an integer
 */
export const toSatoshis = (amount, unit) => {
  if (
    typeof amount !== 'string' ||
    !/^[0-9]*[.]?[0-9]*$/.test(amount) ||
    !unit
  ) {
    throw new Error('Missing args!');
  }
  return Math.round(Number(amount) * UNITS[unit].denominator);
};

/**
 * Convert satoshis to a BTC values than can set as a text input value
 * @param  {number} satoshis The value as a string or number
 * @param  {string} unit            The BTC unit e.g. 'btc' or 'bit'
 * @return {string}                 The amount formatted as '0.0001'
 */
export const toAmount = (satoshis, unit) => {
  if (!Number.isInteger(satoshis) || !UNITS[unit]) {
    throw new Error('Invalid input!');
  }
  return (satoshis / UNITS[unit].denominator).toString();
};

/**
 * Calculate the current fiat currency rate for a satoshi input
 * @param  {number} satoshis The BTC amount in satoshis
 * @param  {Object} settings Contains the current exchange rate
 * @return {string}          The locale formatted rate
 */
export const calculateExchangeRate = (satoshis, settings) => {
  if (
    !Number.isInteger(satoshis) ||
    typeof settings.displayFiat !== 'boolean'
  ) {
    throw new Error('Invalid input!');
  }
  const rate = settings.exchangeRate[settings.fiat];
  const balance = satoshis / rate / UNITS.btc.denominator;
  return formatFiat(balance, settings.fiat);
};

/**
 * Convert a satoshi value either to fiat or the selected BTC unit.
 * The output should be used throughout the UI for value labels.
 * @param  {number} satoshis The BTC amount in satoshis
 * @param  {Object} settings Contains the current exchange rate
 * @return {string}          The corresponding value label
 */
export const toAmountLabel = (satoshis, settings) => {
  if (
    !Number.isInteger(satoshis) ||
    typeof settings.displayFiat !== 'boolean'
  ) {
    throw new Error('Invalid input!');
  }
  return settings.displayFiat
    ? calculateExchangeRate(satoshis, settings)
    : formatNumber(toAmount(satoshis, settings.unit));
};

/**
 * Split '-' separated words and convert to uppercase
 * @param  {string} value     The input string
 * @param  {string} separator The separator to be used
 * @return {string}           The words conected with the separator
 */
export const toCaps = (value = '', separator = ' ') => {
  return value
    .split('-')
    .map(v => v.charAt(0).toUpperCase() + v.substring(1))
    .reduce((a, b) => `${a}${separator}${b}`);
};

/**
 * Convert a base64 encoded string to hex
 * @param  {string} str The base64 encoded string
 * @return {string}     The hex encoded string
 */
export const toHash = str => Buffer.from(str, 'base64').toString('hex');

/**
 * Revers bytes of a buffer
 * @param  {Buffer} src The source buffer
 * @return {Buffer}     The reversed buffer
 */
export const reverse = src => {
  const buffer = Buffer.alloc(src.length);
  for (var i = 0, j = src.length - 1; i <= j; ++i, --j) {
    buffer[i] = src[j];
    buffer[j] = src[i];
  }
  return buffer;
};

/**
 * Check if the HTTP status code signals is successful
 * @param  {Object} response The fetch api's response object
 * @return {Object}          The response object if successful
 */
export const checkHttpStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(response.statusText);
  }
};
