
module.exports = class BettingState {
  constructor(gameState) {
    this.order = gameState.players.map(x=>x.socketId);
    this.players = {}
    gameState.players.forEach( (p) => {
      this.players[p.socketId] = {
        folded: false,
        bet: 0,
        name: p.pubKey,
      }
    })
    this.origin = null;
    this.active = null;
    this.pot = 0;
    this.largestBet = 0;
  }
}
