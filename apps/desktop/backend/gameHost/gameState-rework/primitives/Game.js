const gameAction = require('../utils/gameActions');

module.exports = class Game {
  constructor(roomName, url) {
    //Game Info
    this.roomName = roomName;
    this.host = undefined;
    this.hostURL = url;
    this.history = [];
    this.active = false;
    //States
    this.hand = undefined;
    this.round = undefined;
    this.bets = undefined; // TODO: NEEDED???
    //Players Info
    this.players = {};
    this.order = [];

    this.addPlayer = gameAction.addPlayer;
    this.removePlayer = gameAction.removePlayer;
    this.startRound = gameAction.startRound;
  }
}
