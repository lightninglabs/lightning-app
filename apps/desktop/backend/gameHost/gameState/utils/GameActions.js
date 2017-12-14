const Player = require('../primtives/Player');
const Bet = require('../primtives/Bet');
const Deck = require('../primtives/Deck');

// A function for easilly determing the folded status of a player
function isFolded(player) {
  return this.folded.indexOf(player) !== -1;
}


// Adds a card to the spread
function addCardToSpread() {
  if (!this.deck.cards.length)
    this.deck = new Deck();
  this.spread.push(this.deck.cards.pop());
}


// A function that returns the current pot value (int)
function getPotValue() {
  return !this.pot.length
    ? 0
    : this.pot.reduce((sum, bet) => sum + bet.amount, 0);
}


// Increments state, modular arithmetic (mod 10)
function incrementState() {
  this.state = this.state === 10
    ? 0
    : ++this.state;
}

// Takes in an amount and returns a Bet object.
function makeBet(player, amount) {
    this.potTotal += amount;
    this.pot.push(new Bet(player, amount));
}

/*
  Deals cards to the players.Takes in a dealer(Player object)to
  determine which player to begin with.This is not quite correct
  as in real poker the dealer starts with the player to his / her
  right.However,
  this function does correctly go player by player
  poping one card off the deck at a time,
  adding cards to the
  hand property of each player object.
*/
function dealCards(dealer) {
  const curPlayerIndex = this.players.reduce( (index, x, i) => x.isDealer ? i : index, -1);
  let curIndex;
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < this.players.length; j++) {
      curIndex = (curPlayerIndex + j) % (this.players.length);
      if (this.deck.cards.length) {
        this.players[curIndex].hand.push(this.deck.cards.pop());
      } else {
        this.deck = new Deck();
        this.players[curIndex].hand.push(this.deck.cards.pop());
      }
    }
  }
}

function addFolded(player) {
  this.folded.push(player);
}

// Game reset
// 1) remove cards from all the players hands
// 2) Increment state back to 0
// 3) Remove all cards from spread
// 4) New deck of cards
// 5) Remove all bets from the pot
// 6) Remove all players from folded
function reset() {
  this.players.forEach(x => x.hand = [])
  this.winner = undefined;
  this.incrementState();
  this.spread = [];
  this.deck = new Deck();
  this.pot = [];
  this.folded = [];
}

// Takes in a public key and adds a player object with
// this public key to the players array if it is unique.
function addPlayer(publicKey, socket) {

  const player = this.players.filter(x => x.pubKey === publicKey);
  if (!(player.length)) {
    this.players.push(new Player(publicKey, socket)) //, socket));
  } else {
    player[0].socketId = socket.id;
  }
}

// Takes in a public key and removes a player object with
// this public key.
function removePlayer(publicKey) {
  this.players.splice(this.players.map(x => x.pubKey).indexOf(publicKey), 1);
}

// Rotates the dealer. Instead of outputing the result, it simply
// updates the dealer property of this class.

function newDealer() {
  if (!this.dealer) {
    this.players[0].isDealer = true;
    this.dealer = this.players[0];
  } else {
    const prevDealer = this.players.filter(x => x.isDealer)[0];
    let prevDealerIndex = this.players.indexOf(prevDealer);
    const curDealerIndex = prevDealerIndex === this.players.length - 1
      ? 0
      : prevDealerIndex++;
    this.dealer = this.players[curDealerIndex];
  }
}

module.exports = {
  isFolded,
  addCardToSpread,
  getPotValue,
  incrementState,
  dealCards,
  reset,
  addPlayer,
  removePlayer,
  newDealer,
  makeBet,
  addFolded
}
