/*
  Robert Durst, Lightning Spade, November 20, 2017
  A set of tests covering the determine poker winner functionality.
*/

const chai = require('chai');
const { comparePokerHands, scorePokerHand, determineWinner } = require('../utils/DetermineWinner');
const Card = require('../primtives/Card');
const Deck = require('../primtives/Deck');

let assert = chai.assert;

// Each card is value_num, suite_num
function makeHand(cardArr){
  return cardArr.map( x => new Card(x[0], x[1]));
}

describe('Test Finding Best Hand', function(){
  const hand_1 = makeHand([[14,0],[13,0],[12,0],[11,0],[10,0], [9,0], [8,0]]);
  const hand_2 = makeHand([[12,2],[12,1],[12,0],[9,1],[9,0],[2,1],[2,0]]);
  const hand_3 = makeHand([[5,1],[11,1],[6,1],[3,1],[2,1],[3,0],[5,0]]);
  const hand_4 = makeHand([[3,3],[3,2],[3,1],[14,0],[5,0],[4,0],[6,0]]);
  const hand_5 = makeHand([[14,0],[6,2],[2,2],[2,3],[6,3],[5,0],[5,1]]);

  const score_hand_1 = scorePokerHand(hand_1);
  const score_hand_2 = scorePokerHand(hand_2);
  const score_hand_3 = scorePokerHand(hand_3);
  const score_hand_4 = scorePokerHand(hand_4);
  const score_hand_5 = scorePokerHand(hand_5);

  it('Test hands of length 7.', function(){
    assert.deepEqual(score_hand_1, [9,14]);
    assert.deepEqual(score_hand_2, [6,12,9]);
    assert.deepEqual(score_hand_3, [5,11,6,5,5,3]);
    assert.deepEqual(score_hand_4, [3,3,14,6]);
    assert.deepEqual(score_hand_5, [2,6,5,14]);
  });
});

describe('Test Royal Flush', function(){
  const hand_1 = makeHand([[14,0],[13,0],[12,0],[11,0],[10,0]]);
  const hand_2 = makeHand([[14,1],[13,1],[12,1],[11,1],[10,1]]);

  const score_hand_1 = scorePokerHand(hand_1);
  const score_hand_2 = scorePokerHand(hand_2);

  it("Royal Flush score array should be [ 9, 14]", function(){
    assert.deepEqual(score_hand_1, [9,14]);
  });

  it("Royal Flush score array should be [ 9, 14]", function(){
    assert.deepEqual(score_hand_2, [9,14]);
  });

  it("Tie.", function(){
    assert.equal(comparePokerHands(score_hand_1, score_hand_2), 0);
  });
});

describe('Test Straight Flush', function(){
  const hand_1 = makeHand([[9,0],[13,0],[12,0],[11,0],[10,0]]);
  const hand_2 = makeHand([[9,1],[8,1],[12,1],[11,1],[10,1]]);

  const score_hand_1 = scorePokerHand(hand_1);
  const score_hand_2 = scorePokerHand(hand_2);

  it("Straight Flush score array should be [ 8, 13]", function(){
    assert.deepEqual(score_hand_1, [8,13]);
  });

  it("Straight Flush score array should be [ 8, 12]", function(){
    assert.deepEqual(score_hand_2, [8,12]);
  });

  it("Player one should win with a higher card.", function(){
    assert.equal(comparePokerHands(score_hand_1, score_hand_2), 1);
  });
});

describe('Test Four of a Kind', function(){
  const hand_1 = makeHand([[13,3],[13,2],[13,1],[13,0],[10,0]]);
  const hand_2 = makeHand([[12,3],[12,2],[12,1],[12,0],[9,0]]);

  const score_hand_1 = scorePokerHand(hand_1);
  const score_hand_2 = scorePokerHand(hand_2);

  it("Four of a kind score array should be [ 7, 13, 10]", function(){
    assert.deepEqual(score_hand_1, [7,13,10]);
  });

  it("Four of a kind score array should be [ 7, 12, 9]", function(){
    assert.deepEqual(score_hand_2, [7,12,9]);
  });

  it("Player one should win with a higher card.", function(){
    assert.equal(comparePokerHands(score_hand_1, score_hand_2), 1);
  });
});

describe('Test Full House', function(){
  const hand_1 = makeHand([[13,2],[13,1],[13,0],[10,1],[10,0]]);
  const hand_2 = makeHand([[12,2],[12,1],[12,0],[9,1],[9,0]]);

  const score_hand_1 = scorePokerHand(hand_1);
  const score_hand_2 = scorePokerHand(hand_2);

  it("Full House score array should be [ 6, 13, 10]", function(){
    assert.deepEqual(score_hand_1, [6,13,10]);
  });

  it("Full House score array should be [ 6, 12, 9]", function(){
    assert.deepEqual(score_hand_2, [6,12,9]);
  });

  it("Player one should win with a higher card.", function(){
    assert.equal(comparePokerHands(score_hand_1, score_hand_2), 1);
  });
});

describe('Test Flush', function(){
  const hand_1 = makeHand([[10,0],[9,0],[6,0],[3,0],[2,0]]);
  const hand_2 = makeHand([[5,1],[11,1],[6,1],[3,1],[2,1]]);

  const score_hand_1 = scorePokerHand(hand_1);
  const score_hand_2 = scorePokerHand(hand_2);

  it("Flush score array should be [ 5, 10, 9, 6, 3, 2]", function(){
    assert.deepEqual(score_hand_1, [5,10,9,6,3,2]);
  });

  it("Flush score array should be [ 5, 11, 6, 5, 3, 2]", function(){
    assert.deepEqual(score_hand_2, [5,11,6,5,3,2]);
  });

  it("Player two should win with a higher card.", function(){
    assert.equal(comparePokerHands(score_hand_1, score_hand_2), 2);
  });
});

describe('Test Straight', function(){
  const hand_1 = makeHand([[14,2],[13,1],[12,0],[11,3],[10,3]]);
  const hand_2 = makeHand([[10,0],[9,1],[6,2],[7,3],[8,0]]);

  const score_hand_1 = scorePokerHand(hand_1);
  const score_hand_2 = scorePokerHand(hand_2);

  it("Straight score array should be [ 4, 14]", function(){
    assert.deepEqual(score_hand_1, [4,14]);
  });
  it("Straight score array should be [ 4, 10]", function(){
    assert.deepEqual(score_hand_2, [4,10]);
  });

  it("Player one should win with a higher card.", function(){
    assert.equal(comparePokerHands(score_hand_1, score_hand_2), 1);
  });
});

describe('Test 3 of a Kind', function(){
  const hand_1 = makeHand([[10,2],[10,1],[10,0],[13,0],[2,0]]);
  const hand_2 = makeHand([[3,3],[3,2],[3,1],[14,0],[5,0]]);

  const score_hand_1 = scorePokerHand(hand_1);
  const score_hand_2 = scorePokerHand(hand_2);

  it("Three of a Kind score array should be [ 3, 10, 13, 2]", function(){
    assert.deepEqual(score_hand_1, [3,10,13,2]);
  });

  it("Three of a Kind score array should be [ 3, 3, 14, 5]", function(){
    assert.deepEqual(score_hand_2, [3,3,14,5]);
  });

  it("Player one should win with a higher card.", function(){
    assert.equal(comparePokerHands(score_hand_1, score_hand_2), 1);
  });
});

describe('Test 2 Pair', function(){
  const hand_1 = makeHand([[10,0],[6,0],[2,0],[2,1],[6,1]]);
  const hand_2 = makeHand([[14,0],[6,2],[2,2],[2,3],[6,3]]);

  const score_hand_1 = scorePokerHand(hand_1);
  const score_hand_2 = scorePokerHand(hand_2);

  it("2 Pair score array should be [ 2, 6, 2, 10]", function(){
    assert.deepEqual(score_hand_1, [2,6,2,10]);
  });

  it("2 Pair score array should be [ 2, 6, 2, 14]", function(){
    assert.deepEqual(score_hand_2, [2,6,2,14]);
  });

  it("Player two should win with a higher card.", function(){
    assert.equal(comparePokerHands(score_hand_1, score_hand_2), 2);
  });
});

describe('Test 1 Pair', function(){
  const hand_1 = makeHand([[10,1],[10,0],[11,1],[13,0],[12,0]]);
  const hand_2 = makeHand([[10,3],[10,2],[2,1],[4,0],[5,0]]);

  const score_hand_1 = scorePokerHand(hand_1);
  const score_hand_2 = scorePokerHand(hand_2);

  it("1 Pair score array should be [ 1, 10, 13, 12, 11]", function(){
    assert.deepEqual(score_hand_1, [1,10,13,12,11]);
  });

  it("1 Pair score array should be [ 1, 10, 5, 4, 2]", function(){
    assert.deepEqual(score_hand_2, [1,10,5,4,2]);
  });

  it("Player one should win with a higher card.", function(){
    assert.equal(comparePokerHands(score_hand_1, score_hand_2), 1);
  });
});

describe('Test High Card', function(){
  const hand_1 = makeHand([[9,0],[2,0],[12,1],[11,0],[7,0]]);
  const hand_2 = makeHand([[5,1],[3,3],[2,1],[6,2],[7,2]]);

  const score_hand_1 = scorePokerHand(hand_1);
  const score_hand_2 = scorePokerHand(hand_2);

  it("High Card score array should be [ 0, 12, 11, 9, 7, 2]", function(){
    assert.deepEqual(score_hand_1, [0,12,11,9,7,2]);
  });

  it("High Card score array should be [ 0, 7, 6, 5, 3, 2]", function(){
    assert.deepEqual(score_hand_2, [0,7,6,5,3,2]);
  });

  it("Player one should win with a higher card.", function(){
    assert.equal(comparePokerHands(score_hand_1, score_hand_2), 1);
  });
});

describe('Determine winner from 5 hands.', function(){
  // 1 Pair
  const hand_1 = makeHand([[10,1],[10,0],[11,1],[13,0],[12,0]]);

  // Straight
  const hand_2 = makeHand([[5,1],[3,3],[2,1],[6,2],[7,2]]);

  // Flush
  const hand_3 = makeHand([[2,1],[13,1],[12,1],[11,1],[10,1]]);

  // High Card
  const hand_4 = makeHand([[10,0],[9,1],[6,2],[7,3],[8,0]]);

  // 1 Pair
  const hand_5 = makeHand([[10,3],[10,2],[2,1],[4,0],[5,0]]);

  const score_hand_1 = scorePokerHand(hand_1);
  const score_hand_2 = scorePokerHand(hand_2);
  const score_hand_3 = scorePokerHand(hand_3);
  const score_hand_4 = scorePokerHand(hand_4);
  const score_hand_5 = scorePokerHand(hand_5);

  it('Player 3 should win with a flush.', function(){
    const winnerIndex_1 = determineWinner([score_hand_1, score_hand_2, score_hand_3, score_hand_4, score_hand_5])
    assert.deepEqual(winnerIndex_1, [2]);
  });

  it('Player 1 should win with 1 Pair and higher tie breaker card.', function(){
    const winnerIndex_2 = determineWinner([score_hand_1, score_hand_2, score_hand_5])
    assert.deepEqual(winnerIndex_2, [0]);
  });

  it('Player 1 and player 3 should tie with exact same hand.', function(){
    const winnerIndex_3 = determineWinner([score_hand_1, score_hand_2, score_hand_1])
    assert.deepEqual(winnerIndex_3, [0,2]);
  });
});
