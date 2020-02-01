const routerUsers = require('express').Router();
const {
  validateUserId,
  validateUserData,
  validateUserAvatar,
} = require('../validator/requestValidation');
const {
  findAllUsers,
  findUserById,
  updateUserData,
  updateUserAvatar,
} = require('../controllers/users');

routerUsers.get('/', findAllUsers);
routerUsers.get('/:id', validateUserId, findUserById);
routerUsers.patch('/me', validateUserData, updateUserData);
routerUsers.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = routerUsers;
