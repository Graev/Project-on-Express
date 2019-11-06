const routerCards = require('express').Router();
const path = require('path');
const fs = require('fs');

routerCards.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '..', 'data', 'cards.json'), { encoding: 'utf8' }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(data);
  });
});

module.exports = routerCards;
