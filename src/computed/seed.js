import { computed, extendObservable } from 'mobx';

const ComputedSeed = store => {
  extendObservable(store, {
    seedCheck: computed(() => {
      const { seedMnemonic: words } = store;
      return words.length ? getSeedCheck(1, words.length, 3) : [];
    }),
  });
};

const getSeedCheck = (min, max, numWords) => {
  let indices = [];
  for (let i = 0; i < numWords; i++) {
    let foundValid = false;
    while (!foundValid) {
      let candidate = Math.floor(Math.random() * (max - min + 1)) + min;
      if (indices.indexOf(candidate) == -1) {
        indices.push(candidate);
        foundValid = true;
      }
    }
  }
  return indices.sort((a, b) => a - b);
};

export default ComputedSeed;
