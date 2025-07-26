const ps = require("prompt-sync");
const promptUser = ps();

let suits : string[] = ["hearts", "clubs", "spades", "diamonds"];

var isPlaying : boolean = true;
var isNewGame : boolean = true;
var roundOver : boolean = false;

const cardValues : CardValue[] = [
    {cardName: "two", value: 2},
    {cardName: "three", value: 3},
    {cardName: "four", value: 4},
    {cardName: "five", value: 5},
    {cardName: "six", value: 6},
    {cardName: "seven", value: 7},
    {cardName: "eight", value: 8},
    {cardName: "nine", value: 9},
    {cardName: "ten", value: 10},
    {cardName: "jack", value: 10},
    {cardName: "queen", value: 10},
    {cardName: "king", value: 10},
    {cardName: "ace", value: (11 | 1)},
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
    console.log(`The Dealer dealt two cards to ${player}.\n`);

    return dealtCards;
}

function dealCard(cards: (Card | undefined)[]) {
    return cards.pop()
}

function shouldPlayAgain (message : string){
    console.log(message);
    let shouldPlayAgain = promptUser("Would you like to play again?");
    if(shouldPlayAgain?.toLowerCase() === 'y'){
        console.log("starting new game")
        isNewGame = true;
        isPlaying = false;
        roundOver = true;
    }else{
        isPlaying = false;
    }
}

function sumCards(cards: (Card | undefined)[]){
    const cardSum = cards.reduce( (accumulator, currentvalue) => {
            return accumulator + (currentvalue != undefined ? currentvalue?.cardValue.value : 0)
    }, 0)
    return cardSum;
}

//need to return tuple (best score, lowest score)
function optimalPlay(cards: (Card | undefined)[], numberOfAces: number, player: string) : [number, number]{
    if(numberOfAces == 0){
        let bestScore = sumCards(cards);
        return [bestScore,bestScore];
    }

    console.log(`${player} has ${numberOfAces} aces, finding optimal combination of values`);
    
    let nonAceSum = sumCards(cards.filter(card => card?.cardValue.cardName != "ace"));
    let bestScore = nonAceSum;
    let lowestScore = bestScore + numberOfAces;

    console.log(`Non-Ace sum: ${nonAceSum}`);

    if(nonAceSum + numberOfAces == 21){
        bestScore = nonAceSum + numberOfAces;
        return [bestScore, bestScore];
    }
    
    //let tempScore = nonAceSum;
    //breaks with two aces only
    for(let i = numberOfAces; i > 0; i--){
        if(bestScore + 11 + (numberOfAces - 1) <= 21){
            bestScore += 11;
        }else{
            bestScore += 1;
        }
    }

    console.log(`Best calulated score: ${bestScore}`);
    console.log(cards);
    return [bestScore, lowestScore];
}

function findNumberOfAces(cards: (Card | undefined)[]): number{
    return cards.filter(card => card?.cardValue.cardName == "ace").length;
}
function dealerTurn(dealersCards: (Card | undefined)[], deck: (Card | undefined)[]) : number{
    

    let [dealersSum, lowestScore] = optimalPlay(dealersCards, findNumberOfAces(dealersCards), "Dealer")
    
    while(dealersSum < 17  && deck.length > 0){
        console.log("Dealer hits.")
        dealersCards.push(dealCard(deck));
        console.log(dealersCards);
        [dealersSum, lowestScore] = optimalPlay(dealersCards, findNumberOfAces(dealersCards), "Dealer");
    }

    return dealersSum;
}

function isNatural(){

}

while(isNewGame){
    console.clear();
    console.log("======BLACKJACK=======")
    isPlaying = true;
    roundOver = false;
    let deck = makeDeck();
    let shuffledDeck = shuffleDeck(deck);

    let playersCards = dealStartingCards(shuffledDeck, "player");
    let dealersCards = dealStartingCards(shuffledDeck, "dealer");
    console.log("Player's Cards:");
    console.log(playersCards);
    console.log("Dealer's Cards:");
    console.log(dealersCards);

    while(isPlaying){

        isNewGame = false;
        
        let [playersSum, lowestScore] = optimalPlay(playersCards, findNumberOfAces(playersCards), "Player");
        
        if(playersSum == 21){
            shouldPlayAgain("BLACKJACK!");
        }else if(playersSum > 21) {
            shouldPlayAgain(`BUST! Total: ${playersSum}`);
        }else if(!roundOver){
            let shouldHitAgain = promptUser(`Your highest sum is ${playersSum}, lowest sum is ${lowestScore} hit again?`)
            console.log(`Player chose to ${shouldHitAgain === 'y' ? "hit again" : "stay"}`)
            if(shouldHitAgain?.toLowerCase() === 'y'){
                console.log("Hitting!")
                if(shuffledDeck.length > 0){
                    playersCards.push(dealCard(shuffledDeck)) ;
                    [playersSum, lowestScore] = optimalPlay(playersCards, findNumberOfAces(playersCards), "Player");
                    console.log(playersCards);
                }else{
                    shouldPlayAgain("Deck is out of cards!")
                }
            }else{
                //Dealer's turn
                let dealerSum = dealerTurn(dealersCards, shuffledDeck);
                if(dealerSum > 21){
                    shouldPlayAgain(`Dealer BUSTED! ${dealerSum}`)
                }else if(dealerSum > playersSum){
                    shouldPlayAgain(`Dealer wins! Dealer: ${dealerSum} Player: ${playersSum}`)
                }else if(dealerSum < playersSum){
                    shouldPlayAgain(`Player wins! Dealer: ${dealerSum} Player: ${playersSum}`)
                }else{
                    shouldPlayAgain(`It's a PUSH! Dealer: ${dealerSum} Player: ${playersSum}`)
                }
            }
        }
    }
}
