const Deck = require('./Deck');
const handActions = require('../utils/handActions');

module.exports = class Hand {
  constructor() {
    //Hand Info
    this.state = 0;
    this.dealer = undefined;
    this.pot = 0;
    this.order = [];
    this.winner = undefined;
    //Cards
    this.deck = new Deck();
    this.spread = [];

    this.nextState = gameAction.isFolded;
  }
}
