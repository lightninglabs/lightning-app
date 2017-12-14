module.exports = class Card {
  constructor(cardValue, suiteValue) {
    this.value = cardValue;
    this.suite = numToSuite(suiteValue);
  }
}

function numToSuite(num) {
  switch (num) {
    case 0:
      return 'Spade';
    case 1:
      return 'Diamond';
    case 2:
      return 'Club';
    case 3:
      return 'Heart';
  }
}
