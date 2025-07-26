"use strict";
const ps = require("prompt-sync");
const promptUser = ps();
let suits = ["hearts", "clubs", "spades", "diamonds"];
var isPlaying = true;
var isNewGame = true;
const cardValues = [
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
var test = cardValues.map((cardValue) => {
    return { cardName: cardValue.cardName, value: cardValue.value };
});
const makeDeck = () => {
    const cards = [];
    suits.forEach(suit => {
        cardValues.forEach(cardValue => {
            cards.push({ suit: suit, cardValue: cardValue });
        });
    });
    return cards;
};
const shuffleDeck = (cards) => {
    var shuffledDeck = [];
    const completeDeck = 52;
    let uniqueCards = new Set();
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
    let dealtCards = [];
    for (var i = 0; i < 2; i++) {
        if (cards.length > 0) {
            dealtCards.push(cards.pop());
        }
    }
    console.log(`The Dealer dealt two cards to ${player}.\n`);
    console.log(`${shuffledDeck.length} cards remain in the deck.`);
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
    const cardSum = playersCards.reduce((accumulator, currentvalue) => {
        return accumulator + (currentvalue != undefined ? currentvalue === null || currentvalue === void 0 ? void 0 : currentvalue.cardValue.value : 0);
    }, 0);
    return cardSum;
}
function dealerHit(dealersCards, deck) {
    var dealersSum = sumCards(dealersCards);
    console.log(`Dealer's Sum: ${dealersSum}`);
    while (dealersSum <= 17 && deck.length > 0) {
        dealersCards.push(dealCard(deck));
        dealersSum = sumCards(dealersCards);
    }
}
function isNatural() {
}
while (isNewGame) {
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
        var roundOver = false;
        var playersSum = sumCards(playersCards);
        if (playersSum == 21) {
            shouldPlayAgain("BLACKJACK!");
        }
        else if (playersSum > 21) {
            shouldPlayAgain(`BUST! Total: ${playersSum}`);
        }
        else if (!roundOver) {
            var shouldHitAgain = promptUser(`Your current sum is ${playersSum}, hit again?`);
            console.log(`Player chose to ${shouldHitAgain === 'y' ? "hit again" : "stay"}`);
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
                dealerHit(dealersCards, shuffledDeck);
                if (sumCards(dealersCards) > 21) {
                    shouldPlayAgain(`Dealer BUSTED! ${sumCards(dealersCards)}`);
                }
                roundOver = true;
            }
        }
    }
}
//# sourceMappingURL=main.js.map