const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routerCards.get('/', getCards);
routerCards.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      link: Joi.string()
        .required()
        .domain(),
    }),
  }),
  createCard
);
routerCards.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string()
        .alphanum()
        .length(24),
    }),
  }),
  deleteCard
);
routerCards.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string()
        .alphanum()
        .length(24),
    }),
  }),
  likeCard
);
routerCards.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string()
        .alphanum()
        .length(24),
    }),
  }),
  dislikeCard
);

module.exports = routerCards;
