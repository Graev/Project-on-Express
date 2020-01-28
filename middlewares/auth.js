const jwt = require('jsonwebtoken');
const { JWT_TOKEN } = require('../config');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  let playload;
  try {
    playload = jwt.verify(req.cookie.jwt, JWT_TOKEN);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = playload;
  next();
};
