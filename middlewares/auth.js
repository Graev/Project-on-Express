const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  reqJwt = req.cookie.jwt;

  if (!reqJwt || !reqJwt.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }

  const token = reqJwt.replace("Bearer ", "");
  let playload;
  try {
    playload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }

  req.user = playload;
  next();
};
