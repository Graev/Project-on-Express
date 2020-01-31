/* eslint-disable no-undef */
/* eslint-disable consistent-return */
const Card = require('../models/cards');
const {
  NotFoundError,
  BadRequest,
  AccessError,
} = require('../errorsCatch/errorsCatch');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(card => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  if (name === undefined) {
    throw new BadRequest('Не введено поле name');
  }
  if (link === undefined) {
    throw new BadRequest('Не введено поле link');
  }
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.status(201).send({ data: card }))
    .catch(
      next
      // res.status(500).send({ message: 'Произошла ошибка', err });
    );
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then(card => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (!card.owner._id.equals(req.user._id)) {
        throw new AccessError('Не Вы создавали, не Вам и удалять');
      }
      Card.findByIdAndDelete(req.params.cardId).then(cardDel => {
        return res.send({ data: cardDel, message: 'Успешное удаление' });
      });
    })
    .catch(next);
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then(card => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card.likes });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then(card => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card.likes });
    })
    .catch(next);
};
