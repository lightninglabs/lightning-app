/**
 * @fileOverview helper and utility functions that can be reused go here.
 */

import { UNITS, LND_INIT_DELAY, RETRY_DELAY } from './config';

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
 * Parse a unix time stamp to a JavaScript date object
 * @param  {string} timeStamp The unix time stamp in seconds
 * @return {Date}             The date object
 */
export const parseDate = timeStamp => {
  if (typeof timeStamp !== 'string' || !/^[0-9]+$/.test(timeStamp)) {
    throw new Error('Invalid input!');
  }
  return new Date(parseInt(timeStamp, 10) * 1000);
};

/**
 * Parse satoshi values to an integer number
 * @param  {string} satoshis The integer value as a string
 * @return {number}          The satoshi integer as a number
 */
export const parseSat = satoshis => {
  if (typeof satoshis !== 'string' || !/^-*[0-9]+$/.test(satoshis)) {
    throw new Error('Invalid input!');
  }
  satoshis = parseInt(satoshis, 10);
  if (isNaN(satoshis)) {
    throw new Error('Invalid input!');
  }
  return satoshis;
};

/**
 * Convert a string formatted btc/fiat amount to satoshis
 * @param  {string} amount   The amount e.g. '0.0001'
 * @param  {Object} settings Contains the current exchange rate
 * @return {number}          The satoshis as an integer
 */
export const toSatoshis = (amount, settings) => {
  if (
    typeof amount !== 'string' ||
    !/^[0-9]*[.]?[0-9]*$/.test(amount) ||
    !settings ||
    typeof settings.displayFiat !== 'boolean'
  ) {
    throw new Error('Invalid input!');
  }
  if (settings.displayFiat) {
    const rate = settings.exchangeRate[settings.fiat] || 0;
    return Math.round(Number(amount) * rate * UNITS.btc.denominator);
  } else {
    return Math.round(Number(amount) * UNITS[settings.unit].denominator);
  }
};

/**
 * Convert satoshis to a BTC values than can set as a text input value
 * @param  {number} satoshis The value as a string or number
 * @param  {Object} settings Contains the current exchange rate
 * @return {string}          The amount formatted as '0.0001'
 */
export const toAmount = (satoshis, settings) => {
  if (
    !Number.isInteger(satoshis) ||
    !settings ||
    typeof settings.displayFiat !== 'boolean'
  ) {
    throw new Error('Invalid input!');
  }
  const num = settings.displayFiat
    ? calculateExchangeRate(satoshis, settings)
    : satoshis / UNITS[settings.unit].denominator;
  return num.toLocaleString('en-US', {
    useGrouping: false,
    maximumFractionDigits: 8,
  });
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
  const rate = settings.exchangeRate[settings.fiat] || 0;
  return satoshis / rate / UNITS.btc.denominator;
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
    ? formatFiat(calculateExchangeRate(satoshis, settings), settings.fiat)
    : formatNumber(toAmount(satoshis, settings));
};

/**
 * Convert a string formatted btc/fiat amount either to fiat or the selected BTC unit.
 * The output should be used throughout the UI for value labels.
 * @param  {string} amount   The amount e.g. '0.0001'
 * @param  {Object} settings Contains the current exchange rate
 * @return {string}          The corresponding value label
 */
export const toLabel = (amount, settings) => {
  const satoshis = toSatoshis(amount, settings);
  return toAmountLabel(satoshis, settings);
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
 * Convert a string to bytes
 * @param  {string} str The input string in utf8
 * @return {Buffer}     The output bytes
 */
export const toBuffer = str => {
  if (typeof str !== 'string') {
    throw new Error('Invalid input!');
  }
  return Buffer.from(str, 'utf8');
};

/**
 * Convert bytes to a hex encoded string
 * @param  {Buffer} buf The input as bytes
 * @return {string}     The output as hex
 */
export const toHex = buf => {
  if (!Buffer.isBuffer(buf)) {
    throw new Error('Invalid input!');
  }
  return buf.toString('hex');
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
 * Basic uri validation before rendering. More thorough matching
 * is done by lnd. This is just to mitigates XSS.
 * @param  {string}  str The uri to validate
 * @return {boolean}     If the uri is valid
 */
export const isLnUri = str => {
  return /^lightning:ln[a-zA-Z0-9]*$/.test(str);
};

/**
 * Basic bitcoin address validation. More thorough matching is
 * done by lnd. This is just to mitigate XSS.
 * @param  {string}  str The address to validate
 * @return {boolean}     If the uri is valid
 */
export const isAddress = str => {
  return /^[a-km-zA-HJ-NP-Z0-9]{26,90}$/.test(str);
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

/**
 * Take a nice little nap :)
 * @param  {number} ms The amount of milliseconds to sleep
 * @return {Promise<undefined>}
 */
export const nap = (ms = LND_INIT_DELAY) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * A polling utility that can be used to poll apis. If the api returns
 * a truthy value this utility will stop polling. Errors thrown by the
 * api are just thrown up to the caller to handle.
 * @param {Function} api     The api wrapped in an asynchronous function
 * @param {number} interval  The time interval to wait between polls
 * @param {number} retries   The number of retries to poll the api
 * @return {Promise<Object>} The return value of the api
 */
export const poll = async (api, interval = RETRY_DELAY, retries = Infinity) => {
  while (retries--) {
    const response = await api();
    if (response) return response;
    await nap(interval);
  }
  throw new Error('Maximum retries for polling reached');
};

/**
 * A retry utility that can be used to try multiple requests to an api. This
 * utility will resolve with the return value if the api resolves. Errors
 * thrown by the api are swallowed by this utility and another retry is triggered.
 * @param {Function} api     The api wrapped in an asynchronous function
 * @param {number} interval  The time interval to wait between retries
 * @param {number} retries   The number of retries to be sent to the api
 * @return {Promise<Object>} The return value of the api
 */
export const retry = async (api, interval = 100, retries = 1000) => {
  while (retries--) {
    try {
      return await api();
    } catch (err) {
      if (!retries) throw err;
    }
    await nap(interval);
  }
  return null;
};
