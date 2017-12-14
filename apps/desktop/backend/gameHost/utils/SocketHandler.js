let SocketHandler = (io, game) => {

  let counter = 0;
  let bettingRound;
  io.on('connection', (socket) => {
    game.gameState.addPlayer('Player ' + counter, socket)
    counter++;
    sendUpdate();

    socket.on('CHECK', (data) => {
      sendUpdate()
    })
    socket.on('START_GAME', (data) => {
      game.gameState.dealCards()
      game.gameState.incrementState()
      sendUpdate()
    })

    socket.on('DEAL', (data) => {
      game.gameState.addCardToSpread(game.gameState.deck.cards.pop());
      game.gameState.addCardToSpread(game.gameState.deck.cards.pop());
      game.gameState.addCardToSpread(game.gameState.deck.cards.pop());
      game.gameState.incrementState()
      sendUpdate()
    })
    socket.on('START_BETTING', (data) => {
      bettingRound = {};
      bettingRound['players'] = {}
      bettingRound["order"] = game.gameState.players.map(p => {
        bettingRound.players[p.socketId]
        return p.socketId
      })
      bettingRound['index'] = 0;
      bettingRound['origin'] = bettingRound.order[0];
      io.socket.io.sockets.socket(bettingRound[bettingRound.index].socketId).emit("REQUEST_ACTION")
    })
    socket.on('BET', data => {
      handleAction(bettingRound, data)
    })
    socket.on('FOLD', data => {
      handleAction(bettingRound, data)
    })
    socket.on('CALL', data => {
      handleAction(bettingRound, data)
    })

    // socket.on('BET', (data) => {
    //   game.gameState.makeBet('Nate', 42)
    //   game.gameState.incrementState()
    //   sendUpdate()
    // })
  });

  function sendUpdate() {
    Object.keys(io.sockets.sockets).forEach(id => {
      const totalState = game.gameState;
      let customState = {
        socketId: id,
        pot: totalState.pot,
        potTotal: totalState.potTotal,
        spread: totalState.spread,
        state: totalState.state,
        folded: totalState.folded,
        winner: totalState.winner,
        dealer: totalState.dealer,
        players: totalState.players.map(x => {
          x.pubKey
        }),
        player_hand: totalState.players.filter(x => id === x.socketId)
      };
      io.sockets.sockets[id].emit("GAME_UPDATE", customState);
      io.sockets.sockets[id].emit("LOG", customState);
    })
  }
  function testServer(socket) {
    Object.keys(io.sockets.sockets).forEach(id => {
      requestChoice(socket, id)
    })
  }
  function handleAction(bettingRound, data) {
    if (bettingRound.order[bettingRound.index % bettingRound.order.length]) {
      return bettingRound
    } else {

    }
    switch (data.action) {
      case "BET":
        bettingRound.pot += data.amount
        bettingRound.origin = data.socketId
        break;
      case "CALL":
        bettingRound.index++
        break;
      case "FOLD":
        bettingRound.players[data.socketId].folded = true;
        break;
      default:

    }
  }
  //   playGame();
  //
  //      io.emit("GAME_UPDATE", game.gameState);
  //
  //
  //
  //      socket.on('READY', (stuff) => {
  //        counter ++;
  //        game.gameState.addPlayer('Player '+counter, socket)
  //        io.emit('GAME_UPDATE',game.gameState)
  //      })
  //
  //
  //      socket.on('CALL', (data) => {
  //
  //        io.emit('GAME_UPDATE',game.gameState)
  //      })
  //
  //      socket.on('BET', (data) => {
  //        game.makeBet(data.pid, data.amount)
  //        io.emit('GAME_UPDATE',game.gameState)
  //      })
  //
  //      socket.on('FOLD', (data) => {
  //        game.addFolded(data.pid)
  //        io.emit('GAME_UPDATE',game.gameState)
  //      })
  //
  //
  //    });
  //
  //
  //
  //
  //   function nextState() {
  //     game.gameState.incrementState();
  //     sendUpdate();
  //     playGame();
  //   }
  //
  //   function bettingRound(startIndex) {
  //     let curIndex = startIndex;
  //     let endIndex = startIndex
  //     let waitingFlag = false;
  //     let game = game.gameState;
  //
  //     do {
  //       if(!waitingFlag) {
  //         if( !game.isFolded(game.players[curIndex]) && game.players[curIndex].length) {
  //           GLOBALsocket.emit('LOG');
  //           waitingFlag = true;
  //         } else {
  //           curIndex = (endIndex + 1) % game.players.length;
  //         }
  //       }
  //     } while (curIndex !== endIndex)
  //
  //     GLOBALsocket.on('Call', (data) => {
  //       game.makeBet(game.players[curIndex], amount)
  //       curIndex = (endIndex + 1) % game.players.length;
  //       waitingFlag = false;
  //     })
  //
  //     GLOBALsocket.on('Bet', (amount) => {
  //       endIndex = curIndex;
  //       game.makeBet(game.players[curIndex], amount)
  //       curIndex = (endIndex + 1) % game.players.length;
  //       waitingFlag = false;
  //     })
  //
  //     socket.on('Fold', (data) => {
  //       game.addFolded(game.players[curIndex])
  //       curIndex = (endIndex + 1) % game.players.length;
  //       waitingFlag = false;
  //     })
  //
  //     playGame();
  //   }
  //
  //   let countdown;
  //   function playGame(){
  //     switch( game.gameState.state ) {
  //        A sort of limbo where the host waits for at least two players
  //       case 0:
  //         Wait for all ready or Force start
  //
  //           If there are at least two players in the game, start a game in 10 seconds
  //         if(game.gameState.players.length >= 1 && !countdown) {
  //           countdown = setTimeout( () => {
  //             game.gameState.newDealer;
  //             game.gameState.incrementState();
  //             sendUpdate();
  //             countdown = null;
  //             playGame();
  //           }, 3000 );
  //         } else {
  //           countdown = setTimeout( () => {
  //             countdown = null;
  //             playGame();
  //           }, 1000 );
  //         }
  //         break;
  //
  //        Cards are dealt to the players in the game
  //       case 1:
  //         game.gameState.dealCards();
  //         nextState()
  //         break;
  //
  //        Round one of betting
  //       case 2:
  //         bettingRound()
  //         nextState()
  //         break;
  //
  //        The first three cards are dealt to the spread
  //       case 3:

  //         nextState()
  //         break;
  //
  //        Round two of betting
  //       case 4:
  //         bettingRound()
  //         nextState()
  //         break;
  //
  //        The fourth card is dealt
  //       case 5:
  //         countdown = setTimeout( () => {
  //           game.gameState.addCardToSpread(game.gameState.deck.cards.pop());
  //           game.gameState.incrementState();
  //           sendUpdate();
  //           countdown = null;
  //           playGame();
  //         }, 3000 );
  //         break;
  //
  //        Round three of betting
  //       case 6:
  //         bettingRound()
  //         nextState()
  //         break;
  //
  //        The fifth card is dealt
  //       case 7:
  //         countdown = setTimeout( () => {
  //           game.gameState.addCardToSpread(game.gameState.deck.cards.pop());
  //           game.gameState.incrementState();
  //           sendUpdate();
  //           countdown = null;
  //           playGame();
  //         }, 3000 );
  //         break;
  //
  //        Last round of betting
  //       case 8:
  //         nextState()
  //         break;
  //
  //        Card reveal
  //       case 9:
  //         let hands = game.gameState.players.map( x => x.hand)
  //         hands = hands.filter( x => !!x.length )
  //         hands = hands.map( x => x.concat(game.gameState.spread));
  //         const winnerArr = game.getWinner(hands);
  //         game.gameState.winner = winnerArr;
  //         nextState()
  //         break;
  //
  //        Funds allocated
  //       case 10:
  //         countdown = setTimeout( () => {
  //           game.gameState.reset
  //           game.gameState.incrementState();
  //           sendUpdate();
  //           countdown = null;
  //           playGame();
  //         }, 10000 );
  //         break;
  //     }
  //
}

module.exports = SocketHandler;
