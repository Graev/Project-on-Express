const routerCards = require('express').Router();
const {
  validateAddCard,
  validateCardId,
} = require('../validator/requestValidation');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routerCards.get('/', getCards);
routerCards.post('/', validateAddCard, createCard);
routerCards.delete('/:cardId', validateCardId, deleteCard);
routerCards.put('/:cardId/likes', validateCardId, likeCard);
routerCards.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = routerCards;
