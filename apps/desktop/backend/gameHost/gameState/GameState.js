const Game = require('./primtives/Game');
const DetermineWinner = require('./utils/DetermineWinner').getWinner;

const game = new Game();


module.exports = {
  gameState: game,
  getWinner: DetermineWinner
}
