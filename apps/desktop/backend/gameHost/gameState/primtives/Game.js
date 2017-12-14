const Deck = require('./Deck');
const gameAction = require('../utils/gameActions');

module.exports = class Game {
  constructor() {
    this.deck = new Deck();
    this.pot = [];
    this.potTotal = 0;
    this.spread = [];
    this.folded = [];
    this.state = 0;
    this.winner = undefined;
    this.players = [];
    this.dealer = undefined;

    this.isFolded = gameAction.isFolded;
    this.addCardToSpread = gameAction.addCardToSpread;
    this.getPotValue = gameAction.getPotValue;
    this.incrementState = gameAction.incrementState;
    this.dealCards = gameAction.dealCards;
    this.reset = gameAction.reset;
    this.addPlayer = gameAction.addPlayer;
    this.removePlayer = gameAction.removePlayer;
    this.newDealer = gameAction.newDealer;
    this.makeBet = gameAction.makeBet;
    this.addFolded = gameAction.addFolded;
  }
}
