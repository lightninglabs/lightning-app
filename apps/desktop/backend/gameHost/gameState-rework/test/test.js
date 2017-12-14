function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

// importTest("Determing Winning Poker Hand Tests", './DetermineWinnerTest');
importTest("Game State Tests", './stateTest');
