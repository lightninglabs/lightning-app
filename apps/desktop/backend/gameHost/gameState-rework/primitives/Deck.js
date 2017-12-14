const Card = require('./Card');
const _ = require('underscore');

module.exports = class Deck {
  constructor() {
    this.cards = [];

    // Generate all the cards
    for (var i = 0; i < 4; i++) {
      for (var j = 1; j < 14; j++) {
        this.cards.push(new Card(j, i));
      }
    }

    // Shuffle the cards
    this.cards = _.shuffle(this.cards);
  }
}
