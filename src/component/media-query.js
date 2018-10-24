/*
Copyright (c) 2016, Marco Sampellegrini <babbonatale@alpacaaa.net>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee
is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE
INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE
FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

import { Dimensions } from 'react-native';

const computeStyles = (dimensions, base, ...extra) => {
  return extra.reduce((acc, fn) => {
    const properties = fn(dimensions);
    const merged = Object.keys(properties).reduce(
      (s_acc, key) => ({
        ...s_acc,
        [key]: { ...base[key], ...properties[key] },
      }),
      {}
    );

    return {
      ...acc,
      ...merged,
    };
  }, base);
};

const getStyles = base => {
  let styles = {};
  let computed = {};

  Object.keys(base).map(key =>
    Object.defineProperty(styles, key, {
      get: function() {
        return computed[key];
      },
    })
  );

  const update = newStyles => {
    if (JSON.stringify(newStyles) === JSON.stringify(computed)) {
      return false;
    }

    computed = newStyles;
    return true;
  };

  return { styles, update };
};

export const createStyles = (base, ...extra) => {
  const { styles, update } = getStyles(base);

  styles.onLayout = fn => () => {
    const dimensions = Dimensions.get('window');
    const computed = computeStyles(dimensions, base, ...extra);
    const changed = update(computed);
    if (changed && fn) fn();
  };

  styles.onLayout()();
  return styles;
};

const createQueryFn = test => (target, styles) => dimensions => {
  if (!test(target, dimensions)) return {};

  return typeof styles === 'function' ? styles(dimensions) : styles;
};

export const maxHeight = createQueryFn(
  (target, { height }) => target >= height
);
export const minHeight = createQueryFn(
  (target, { height }) => target <= height
);

export const maxWidth = createQueryFn((target, { width }) => target >= width);
export const minWidth = createQueryFn((target, { width }) => target <= width);

const aspectRatioRound = value => value.toFixed(2);
const aspectRatioQuery = fn =>
  createQueryFn((target, { width, height }) => {
    return fn(aspectRatioRound(target), aspectRatioRound(width / height));
  });

export const maxAspectRatio = aspectRatioQuery(
  (target, aspectRatio) => target >= aspectRatio
);
export const minAspectRatio = aspectRatioQuery(
  (target, aspectRatio) => target <= aspectRatio
);
export const aspectRatio = aspectRatioQuery(
  (target, aspectRatio) => target === aspectRatio
);
