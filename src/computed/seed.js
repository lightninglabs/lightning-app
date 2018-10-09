/**
 * @fileOverview computed values that are used in seed UI components.
 */

import { extendObservable } from 'mobx';

const ComputedSeed = store => {
  extendObservable(store, {
    get seedVerifyIndexes() {
      const { seedMnemonic: words } = store;
      return words.length ? getSeedIndexes(1, words.length, 3) : [];
    },
    get seedVerifyCopy() {
      const { seedVerifyIndexes } = store;
      const c0 = formatOrdinal(seedVerifyIndexes[0]);
      const c1 = formatOrdinal(seedVerifyIndexes[1]);
      const c2 = formatOrdinal(seedVerifyIndexes[2]);
      return `Type the ${c0}, ${c1}, and ${c2} words of your recovery phrase.`;
    },
    get restoreIndexes() {
      return [...Array(24).keys()].map(x => ++x);
    },
    get restoreVerifyIndexes() {
      const { restoreIndexes } = store;
      const { restoreIndex } = store.wallet;
      return restoreIndexes.slice(restoreIndex, restoreIndex + 3);
    },
    get restoreVerifyCopy() {
      const { restoreVerifyIndexes } = store;
      const c0 = formatOrdinal(restoreVerifyIndexes[0]);
      const c1 = formatOrdinal(restoreVerifyIndexes[1]);
      const c2 = formatOrdinal(restoreVerifyIndexes[2]);
      return `Type the ${c0}, ${c1}, and ${c2} words of your recovery phrase.`;
    },
  });
};

/**
 * Get an array of seed word indexes to verify
 * @param  {number} min      The smallest possible index
 * @param  {number} max      The largest possible index
 * @param  {number} numWords The length of the array to generate
 * @return {Array}           The array of indexes to verify
 */
const getSeedIndexes = (min, max, numWords) => {
  let indices = [];
  for (let i = 0; i < numWords; i++) {
    let foundValid = false;
    while (!foundValid) {
      let candidate = Math.floor(Math.random() * (max - min + 1)) + min;
      if (indices.indexOf(candidate) === -1) {
        indices.push(candidate);
        foundValid = true;
      }
    }
  }
  return indices.sort((a, b) => a - b);
};

/**
 * Format the index of seed word as ordinal.
 * @param  {number} val The number value
 * @return {string}     The ordinal of the index
 */
export const formatOrdinal = val => {
  let num = Number(val);
  if (isNaN(num)) {
    num = 0;
  }
  const j = num % 10,
    k = num % 100;
  if (j === 1 && k !== 11) {
    return num.toString() + 'st';
  }
  if (j === 2 && k !== 12) {
    return num.toString() + 'nd';
  }
  if (j === 3 && k !== 13) {
    return num.toString() + 'rd';
  }
  return num.toString() + 'th';
};

export default ComputedSeed;
