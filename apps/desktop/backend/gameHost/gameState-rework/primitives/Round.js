const roundActions = require('../utils/roundActions');

module.exports = class Round {
  constructor() {
    //Highest Bet Info
    this.origin = undefined;
    this.largestBet = 0;
    //Next Player
    this.active = undefined;
    //Pot
    this.pot = 0;

    this.bet = gameAction.isFolded;
    this.call = gameAction.addCardToSpread;
    this.fold = gameAction.getPotValue;
  }
}
