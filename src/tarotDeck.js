// // Define the suits and values
// const fs = require('fs');

// // Read in the JSON file
// const rawData = fs.readFileSync('public/card_data.json', 'utf-8');
// const jsonData = JSON.parse(rawData);
// const { cards } = jsonData;
// const tarotDeck = cards.map(card => parseInt(card.name_short.match(/\d+/)[0]));
// const cardsSelected = [];
import data from './card_data.json'

export function getDeck() {
  return data.cards;
}
// Shuffle the deck
export function shuffleCards(tarotDeck) {
  for (let i = tarotDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tarotDeck[i], tarotDeck[j]] = [tarotDeck[j], tarotDeck[i]];
  }
  return tarotDeck
}

export function drawCards(numCards, tarotDeck) {
  const remainingCards = [...tarotDeck];
  const cardsSelected = [];
  for (let i = 0; i < numCards; i++) {
    const randomIndex = Math.floor(Math.random() * remainingCards.length);
    cardsSelected.push(
      remainingCards[randomIndex]
    );
    remainingCards.splice(randomIndex, 1);
    }
  return cardsSelected;
}

export function getFortuneTelling(seed) {
  fetch("http://127.0.0.1:5000/api/fortune-telling", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(seed),
  })
    .then((response) =>  { return response.json() })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));


}
