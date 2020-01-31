const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  findAllUsers,
  findUserById,
  updateUserData,
  updateUserAvatar,
} = require('../controllers/users');

routerUsers.get('/', findAllUsers);
routerUsers.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string()
        .alphanum()
        .length(24),
    }),
  }),
  findUserById
);
routerUsers.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      about: Joi.string()
        .required()
        .min(2)
        .max(30),
    }),
  }),
  updateUserData
);
routerUsers.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .domain(),
    }),
  }),
  updateUserAvatar
);

module.exports = routerUsers;
