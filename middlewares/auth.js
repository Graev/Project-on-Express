const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  let reqJwt;
  try {
    reqJwt = req.cookie.jwt;
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  if (!reqJwt || !reqJwt.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = reqJwt.replace('Bearer ', '');
  let playload;
  try {
    playload = jwt.verify(
      token,
      'ea4d7d87d193658e6c08c5500e0e984b3102a6cf3a77f4678fff714eb75b023f'
    );
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = playload;
  next();
};
