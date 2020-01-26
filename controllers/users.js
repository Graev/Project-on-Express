/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports.findAllUsers = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.findUserById = (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { email, name, password, about, avatar } = req.body;
  if (email === undefined) {
    return res.status(400).send({
      message: 'Не введено поле email',
    });
  }
  if (name === undefined) {
    return res.status(400).send({
      message: 'Не введено поле name',
    });
  }
  if (password === undefined) {
    return res.status(400).send({
      message: 'Не введено поле password',
    });
  }
  if (about === undefined) {
    return res.status(400).send({
      message: 'Не введено поле about',
    });
  }
  if (avatar === undefined) {
    return res.status(400).send({
      message: 'Не введено поле avatar',
    });
  }

  bcrypt.hash(password, 10).then(hash => {
    User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    })
      .then(() =>
        res.status(201).send({ message: 'Пользователь успешно создан' })
      )
      .catch(
        () => {
          res.status(500).send({ message: 'Произошла ошибка' });
        }
        // res.status(500).send({ message: 'Произошла ошибка', err });
      );
  });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials({ email, password })
    .then(user => {
      const token = jwt.sign(
        { _id: user._id },
        'ea4d7d87d193658e6c08c5500e0e984b3102a6cf3a77f4678fff714eb75b023f',
        {
          expiresIn: '7d',
        }
      );
      res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
        sameSite: true,
      });
    })
    .catch(err => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
