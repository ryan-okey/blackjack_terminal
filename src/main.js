var ps = require("prompt-sync");
var promptUser = ps();
var suits = ["hearts", "clubs", "spades", "diamonds"];
var isPlaying = true;
var isNewGame = true;
var roundOver = false;
var cardValues = [
    { cardName: "two", value: 2 },
    { cardName: "three", value: 3 },
    { cardName: "four", value: 4 },
    { cardName: "five", value: 5 },
    { cardName: "six", value: 6 },
    { cardName: "seven", value: 7 },
    { cardName: "eight", value: 8 },
    { cardName: "nine", value: 9 },
    { cardName: "ten", value: 10 },
    { cardName: "jack", value: 10 },
    { cardName: "queen", value: 10 },
    { cardName: "king", value: 10 },
    { cardName: "ace", value: 11 | 1 },
];
var test = cardValues.map(function (cardValue) {
    return { cardName: cardValue.cardName, value: cardValue.value };
});
var makeDeck = function () {
    var cards = [];
    suits.forEach(function (suit) {
        cardValues.forEach(function (cardValue) {
            cards.push({ suit: suit, cardValue: cardValue });
        });
    });
    return cards;
};
var shuffleDeck = function (cards) {
    var shuffledDeck = [];
    var completeDeck = 52;
    var uniqueCards = new Set();
    while (uniqueCards.size < completeDeck) {
        var index = Math.floor(Math.random() * (completeDeck - 0));
        if (!uniqueCards.has(index)) {
            uniqueCards.add(index);
            shuffledDeck.push(cards[index]);
        }
    }
    return shuffledDeck;
};
function dealStartingCards(cards, player) {
    var dealtCards = [];
    for (var i = 0; i < 2; i++) {
        if (cards.length > 0) {
            dealtCards.push(cards.pop());
        }
    }
    console.log("The Dealer dealt two cards to ".concat(player, ".\n"));
    console.log("".concat(shuffledDeck.length, " cards remain in the deck."));
    return dealtCards;
}
function dealCard(cards) {
    return cards.pop();
}
function shouldPlayAgain(message) {
    console.log(message);
    var shouldPlayAgain = promptUser("Would you like to play again?");
    if ((shouldPlayAgain === null || shouldPlayAgain === void 0 ? void 0 : shouldPlayAgain.toLowerCase()) === 'y') {
        isNewGame = true;
        isPlaying = false;
        ;
    }
    else {
        isPlaying = false;
    }
}
function sumCards(cards) {
    var cardSum = cards.reduce(function (accumulator, currentvalue) {
        return accumulator + (currentvalue != undefined ? currentvalue === null || currentvalue === void 0 ? void 0 : currentvalue.cardValue.value : 0);
    }, 0);
    return cardSum;
}
function dealerHit(dealersCards, deck) {
    var dealersSum = sumCards(dealersCards);
    console.log("Dealer's Sum: ".concat(dealersSum));
    console.log(dealersCards);
    while (dealersSum <= 17 && deck.length > 0) {
        dealersCards.push(dealCard(deck));
        dealersSum = sumCards(dealersCards);
        console.log(dealersSum);
    }
}
function isNatural() {
}
while (isNewGame) {
    console.log("======BLACKJACK=======");
    console.clear();
    isPlaying = true;
    var deck = makeDeck();
    var shuffledDeck = shuffleDeck(deck);
    var playersCards = dealStartingCards(shuffledDeck, "player");
    var dealersCards = dealStartingCards(shuffledDeck, "dealer");
    console.log("Player's Cards:");
    console.log(playersCards);
    console.log("Dealer's Cards:");
    console.log(dealersCards);
    while (isPlaying) {
        isNewGame = false;
        var playersSum = sumCards(playersCards);
        if (playersSum == 21) {
            shouldPlayAgain("BLACKJACK!");
        }
        else if (playersSum > 21) {
            shouldPlayAgain("BUST! Total: ".concat(playersSum));
        }
        else if (!roundOver) {
            var shouldHitAgain = promptUser("Your current sum is ".concat(playersSum, ", hit again?"));
            console.log("Player chose to ".concat(shouldHitAgain === 'y' ? "hit again" : "stay"));
            if ((shouldHitAgain === null || shouldHitAgain === void 0 ? void 0 : shouldHitAgain.toLowerCase()) === 'y') {
                console.log("Hitting!");
                if (shuffledDeck.length > 0) {
                    playersCards.push(dealCard(shuffledDeck));
                    console.log(playersCards);
                }
                else {
                    shouldPlayAgain("Deck is out of cards!");
                }
            }
            else {
                roundOver = true;
                dealerHit(dealersCards, shuffledDeck);
                var dealerSum = sumCards(dealersCards);
                playersSum = sumCards(playersCards);
                if (sumCards(dealersCards) > 21) {
                    shouldPlayAgain("Dealer BUSTED! ".concat(sumCards(dealersCards)));
                }
                else if (dealerSum > playersSum) {
                    shouldPlayAgain("Dealer wins! Dealer: ".concat(dealerSum, " Player: ").concat(playersSum));
                }
                else if (dealerSum < playersSum) {
                    shouldPlayAgain("Player wins! Dealer: ".concat(dealerSum, " Player: ").concat(playersSum));
                }
                else {
                    shouldPlayAgain("It's a PUSH! Dealer: ".concat(dealerSum, " Player: ").concat(playersSum));
                }
            }
        }
    }
}
