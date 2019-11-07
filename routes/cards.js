const routerCards = require('express').Router();
const path = require('path');
const cardsJSON = require(path.join(__dirname, '..', 'data', 'cards.json'));

routerCards.get('/', (req, res) => {
  res.send(cardsJSON);
});

module.exports = routerCards;
