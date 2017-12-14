const Player = require('../primitives/Player')
const Hand = require('../primitives/Hand');
//Adds player to state object
function addPlayer(id) {
  this.players[id] = new Player(id)
  this.order.push(id);
}
//Adds player to state object
function makeHost(id) {
  if (this.host) {
    const oldHostID = this.host;
    this.players[oldHostID].isHost = false;
  }
  this.host = id;
  this.players[id].isHost = true;
}
//Remove Player from state
function removePlayer(id) {
  delete this.players[id]
  this.order.splice(this.order.indexOf(id),1);
}
//Starts new Hand all players
function startHand() {
  this.hand = new Hand()
  for (var key in this.players) {
    this.hand.order.push()
  }
}

module.exports = {
  addPlayer,
  removePlayer,
  startHand,
}
