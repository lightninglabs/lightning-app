export const formatSatoshis = val => {
  const num = Number(val);
  if (isNaN(num)) {
    return '';
  } else {
    return `${num.toLocaleString()}`;
  }
};
