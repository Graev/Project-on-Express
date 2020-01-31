const jwt = require('jsonwebtoken');
const { JWT_TOKEN, NODE_ENV } = require('../config');
const { AuthError } = require('../errorsCatch/errorsCatch');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  let playload;
  try {
    playload = jwt.verify(
      req.cookies.jwt,
      NODE_ENV === 'production' ? JWT_TOKEN : 'dev-secret'
    );
  } catch (err) {
    const error = new AuthError('Ошибка аутентификации или авторизации');
    next(error);
  }

  req.user = playload;
  next();
};
