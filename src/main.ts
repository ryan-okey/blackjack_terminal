const ps = require("prompt-sync");
const promptUser = ps();

const suits : string[] = ["Hearts", "Clubs", "Spades", "Diamonds"];

var isPlaying : boolean = true;
var isNewGame : boolean = true;
var shouldRoundContinue : boolean = true;
var isPlayerTurn : boolean = true;

const cardValues : CardValue[] = [
    {cardName: "Two", value: 2},
    {cardName: "Three", value: 3},
    {cardName: "Four", value: 4},
    {cardName: "Five", value: 5},
    {cardName: "Six", value: 6},
    {cardName: "Seven", value: 7},
    {cardName: "Eight", value: 8},
    {cardName: "Nine", value: 9},
    {cardName: "Ten", value: 10},
    {cardName: "Jack", value: 10},
    {cardName: "Queen", value: 10},
    {cardName: "King", value: 10},
    {cardName: "Ace", value: (11 | 1)},
]

type CardValue = {
    cardName: string,
    value: number
}
type Card = {
    suit: string,
    cardValue: CardValue
}
type Deck = {
    cards: Card[]
}

const makeDeck = ()=> {
    const cards : Card[] = [];
    suits.forEach(suit => {
        cardValues.forEach(cardValue => {
            cards.push({suit: suit, cardValue: cardValue})
        })
    });
    return cards;
} 

const shuffleDeck = (cards: Card[]) => {
    let shuffledDeck = [];
    const completeDeck = 52;
    let uniqueCards : Set<number> = new Set<number>();

    while(uniqueCards.size < completeDeck){
        let index = Math.floor(Math.random() * (completeDeck - 0));
        
        if(!uniqueCards.has(index)){
            uniqueCards.add(index);
            shuffledDeck.push(cards[index]);
        }
    }

    return shuffledDeck;
}

function dealStartingCards(cards: Card[], player: string) {
    let dealtCards = []
    for(let i = 0; i < 2; i++){
        if(cards.length > 0){
            dealtCards.push(cards.pop());
        }
       
    }
    console.log(`The Dealer dealt two cards to ${player}.`);

    return dealtCards;
}

function dealCard(cards: (Card | undefined)[]) {
    return cards.pop()
}

function shouldPlayAgain (message : string){
    console.log(message);
    let shouldPlayAgain = promptUser("Would you like to play again? (y/n)");
    if(shouldPlayAgain?.toLowerCase() === 'y'){
        isNewGame = true;
        isPlaying = false;
        shouldRoundContinue = false;
        isPlayerTurn = false;
    }else{
        console.log("======GAME OVER=======")
        isPlaying = false;
        shouldRoundContinue = false;
        isPlayerTurn = false;
        isNewGame = false;
    }
}

function sumCards(cards: (Card | undefined)[]){
    const cardSum = cards.reduce( (accumulator, currentvalue) => {
            return accumulator + (currentvalue != undefined ? currentvalue?.cardValue.value : 0)
    }, 0)
    return cardSum;
}

//need to return tuple (best score, lowest score)
function optimalPlay(cards: (Card | undefined)[], numberOfAces: number) : [lowestScore: number, bestScore: number]{
    if(numberOfAces == 0){
        console.log(`${numberOfAces}`)
        let bestScore = sumCards(cards);
        return [bestScore,bestScore];
    }
    
    let nonAceSum = sumCards(cards.filter(card => card?.cardValue.cardName.toLowerCase() != "ace"));
    let bestScore = nonAceSum;
    let lowestScore = bestScore + numberOfAces;

    if(nonAceSum + numberOfAces == 21){
        bestScore = nonAceSum + numberOfAces;
        return [bestScore, bestScore];
    }
    
    for(let i = numberOfAces; i > 0; i--){
        if(bestScore + 11 + (numberOfAces - 1) <= 21){
            bestScore += 11;
        }else{
            bestScore += 1;
        }
    }

    return [lowestScore, bestScore];
}

function findNumberOfAces(cards: (Card | undefined)[]): number{
    return cards.filter(card => card?.cardValue.cardName.toLowerCase() == "ace").length;
}

function dealerTurn(dealersCards: (Card | undefined)[], deck: (Card | undefined)[]) : number{
    console.clear();
    console.log("====== DEALER's TURN =======")

    let [lowestScore, bestScore] = optimalPlay(dealersCards, findNumberOfAces(dealersCards))
    
    //House rules:  Dealer must STAY at a 'soft 17', aka an Ace + Six
    while(bestScore < 17  && deck.length > 0){
        console.log("Dealer hits.")
        dealersCards.push(dealCard(deck));
        console.log(dealersCards);
        [lowestScore, bestScore] = optimalPlay(dealersCards, findNumberOfAces(dealersCards));
    }

    return bestScore;
}

function displayCards(cards: (Card | undefined)[], name: string){
    console.log(`\n${name}'s Cards:`);
    cards.forEach(card => console.log(`[${card?.cardValue.cardName} of ${card?.suit}]`));
}

function playerTurn(playerCards: (Card | undefined)[], deck : (Card | undefined)[],) : number {
    
    console.log("\n====== Player's TURN =======")
    let [lowestScore, highestScore] = highAndLowSums(playerCards);
    displayCards(playerCards, "Player");
    checkWinOrBust(highestScore, lowestScore);
    
    while(isPlayerTurn){
        isPlayerTurn = (promptUser(`Your highest sum is ${highestScore}, lowest sum is ${lowestScore} hit again?`)) === 'y'? true : false;
        if(isPlayerTurn){ 
            console.log(`Player chose to ${isPlayerTurn ? "hit again!" : "stay!"}`)
            if(deck.length > 0){
                playerCards.push(dealCard(deck)) ;
                [lowestScore, highestScore] = highAndLowSums(playerCards);
            }else{
                shouldPlayAgain("Deck is out of cards!")
            }
        }else{
            console.log(`\nPlayer chose to ${isPlayerTurn ? "hit again!" : "stay!"}`)
        }
        displayCards(playerCards, "Player");
        checkWinOrBust(highestScore, lowestScore);
    }

    return highestScore;
}

function checkWinOrBust(highestScore : number, lowestScore : number){
    if(highestScore == 21 || lowestScore == 21){
        shouldPlayAgain("\nBLACKJACK!");
    }else if(lowestScore > 21) {
        shouldPlayAgain(`BUST! Total: ${lowestScore}`);
    }
}

function highAndLowSums(cards: (Card | undefined)[]) : [lowestScore: number, highestScore: number]{
    let aceCount = findNumberOfAces(cards);
    let nonAceSum = sumCards(cards.filter(card => card?.cardValue.cardName.toLowerCase() != "ace"));
    return [aceCount + nonAceSum, (aceCount * 11) + nonAceSum];
}

while(isNewGame){
    console.clear();
    console.log("======BLACKJACK=======")
    isPlaying = true;
    isPlayerTurn = true;
    shouldRoundContinue = true;
    let deck = makeDeck();
    let shuffledDeck = shuffleDeck(deck);

    let playerCards = dealStartingCards(shuffledDeck, "player");
    let dealerCards = dealStartingCards(shuffledDeck, "dealer");
 
    console.log("\nDealer's Cards:");
    console.log(`[${dealerCards[0]?.cardValue.cardName} of ${dealerCards[0]?.suit}]`);

    while(isPlaying){

        isNewGame = false;
        
        
        let playerSum = playerTurn(playerCards, shuffledDeck);
        //Dealer's turn
        if(shouldRoundContinue){
            let dealerSum = dealerTurn(dealerCards, shuffledDeck);
            displayCards(playerCards, "Player");
            displayCards(dealerCards, "Dealer");
            
            if(dealerSum > 21){
                shouldPlayAgain(`Dealer BUSTED! ${dealerSum}`)
            }else if(dealerSum > playerSum){
                shouldPlayAgain(`Dealer wins! Dealer: ${dealerSum} Player: ${playerSum}`)
            }else if(dealerSum < playerSum){
                shouldPlayAgain(`Player wins! Dealer: ${dealerSum} Player: ${playerSum}`)
            }else{
                shouldPlayAgain(`It's a PUSH! Dealer: ${dealerSum} Player: ${playerSum}`)
            }
        }
    }
}
