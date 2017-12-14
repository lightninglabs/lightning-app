
module.exports = class Player {
  constructor(id) {
    //Game Level
    this.id = id;
    this.balance = 0;
    this.socketId = 0;
    this.displayName = 0;
    this.gameStatus = undefined;
    this.isHost = undefined;
    //Hand Level
    this.hand = []
    this.handStatus = undefined;
    this.isDealer = undefined;

    this.isFolded = gameAction.isFolded;
    this.addCardToSpread = gameAction.addCardToSpread;
    this.getPotValue = gameAction.getPotValue;
    this.incrementState = gameAction.incrementState;
  }
}
