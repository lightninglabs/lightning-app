const Player = require('./Player');

module.exports = class Bet {
  constructor(betPlayer, betAmount) {
    this.player = betPlayer;
    this.amount = betAmount;
  }
}
