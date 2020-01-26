/* eslint-disable consistent-return */
const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(card => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  if (name === undefined) {
    return res.status(400).send({ message: 'Не введено поле name' });
  }
  if (link === undefined) {
    return res.status(400).send({ message: 'Не введено поле link' });
  }
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.status(201).send({ data: card }))
    .catch(
      () => {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
      // res.status(500).send({ message: 'Произошла ошибка', err });
    );
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (!(card.owner._id === req.user._id)) {
        return res
          .status(403)
          .send({ message: 'Не Вы создавали, не Вам и удалять' });
      }
      return res.send({ data: card });
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then(card => res.send({ data: card.likes }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then(card => res.send({ data: card.likes }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
