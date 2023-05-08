const fs = require('fs');

// Read in the JSON file
const rawData = fs.readFileSync('public/card_data.json', 'utf-8');

// Parse the JSON data
const jsonData = JSON.parse(rawData);

// Define an array of card names
let fileNames = [];
fs.readdir('public/images/deck', (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    // Extract the file names by removing the extension
    fileNames = files.map(file => file.replace(/\.[^/.]+$/, ""));
  });
// Extract the cards array
const { cards } = jsonData;

// Check if the card names match the names in the file
const fileCardNameSet = new Set(cards.map(card => card.name_short));
const cardNumbers = cards.map(card => parseInt(card.name_short.match(/\d+/)[0]));

cards.map(card => {
    name_short_num = parseInt(card.name_short.match(/\d+/)[0])
    fileNames.filter(str => str.start)
})

// if (isMatch) {
//   console.log('The card names match!');
// } else {
//   console.log('The card names do not match.');
// }
