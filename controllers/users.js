/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { JWT_TOKEN, NODE_ENV } = require('../config');
const {
  NotFoundError,
  BadRequest,
  AuthError,
} = require('../errorsCatch/errorsCatch');

module.exports.findAllUsers = (req, res, next) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(next);
};

module.exports.findUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, name, password, about, avatar } = req.body;
  if (email === undefined) {
    throw new BadRequest('Не введено поле email');
  }
  if (name === undefined) {
    throw new BadRequest('Не введено поле name');
  }
  if (password === undefined) {
    throw new BadRequest('Не введено поле password');
  }
  if (about === undefined) {
    throw new BadRequest('Не введено поле about');
  }
  if (avatar === undefined) {
    throw new BadRequest('Не введено поле avatar');
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return bcrypt.hash(password, 10).then(hash => {
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
            .catch(next);
        });
      }
      throw new BadRequest('Пользователь с данным email уже существует');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(user => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_TOKEN : 'dev-secret',
        {
          expiresIn: '7d',
        }
      );
      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch(() => {
      throw new AuthError('Ошибка аутентификации или авторизации');
    })
    .catch(next);
};

module.exports.updateUserData = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then(user => res.send({ data: user }))
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then(user => res.send({ data: user }))
    .catch(next);
};
