const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      switch (err.message) {
        case 'user validation failed: about: Path `name` is required.':
          res.status(404).send({ message: 'Не введено поле name' });
          break;
        case 'user validation failed: name: Path `link` is required.':
          res.status(404).send({ message: 'Не введено поле link' });
          break;
        default:
          res.status(500).send({ message: 'Произошла ошибка' });
      }
      // res.status(500).send({ message: 'Произошла ошибка', err });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => res.status(404).send({ message: 'Карточка не найдена' }))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const statusCode = (err.message.includes('Cast to ObjectId failed')) ? 404 : 500;
      const message = statusCode === 404 ? 'Неверно указан ID карточки' : 'Произошла ошибка';
      res.status(statusCode).send({ message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card.likes }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card.likes }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
