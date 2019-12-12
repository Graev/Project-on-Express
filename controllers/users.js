const bcrypt = require("bcryptjs");
const User = require("../models/users");

module.exports.findAllUsers = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.findUserById = (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      return res.send({ data: user });
    })
    .catch(err => {
      const statusCode = err.message.includes("Cast to ObjectId failed")
        ? 404
        : 500;
      const message =
        statusCode === 404
          ? "Неверно указан ID пользователя"
          : "Произошла ошибка";
      res.status(statusCode).send({ message });
    });
};

module.exports.createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;
  bcrypt.hash(password, 10).then(hash => {
    password = hash;
    User.create({ email, password, name, about, avatar })
      .then(user => res.status(201).send({ data: user }))
      .catch(err => {
        switch (err.message) {
          case "user validation failed: about: Path `about` is required.":
            res.status(404).send({ message: "Не введено поле about" });
            break;
          case "user validation failed: name: Path `name` is required.":
            res.status(404).send({ message: "Не введено поле name" });
            break;
          case "user validation failed: avatar: Path `avatar` is required.":
            res.status(404).send({ message: "Не введено поле avatar" });
            break;
          case "user validation failed: avatar: Введена не ссылка":
            res.status(404).send({ message: "Введена не ссылка" });
            break;
          default:
            res.status(500).send({ message: "Произошла ошибка" });
        }
        // res.status(500).send({ message: 'Произошла ошибка', err });
      });
  });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials({ email, password })
    .then(user => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
      });
      res.cookie("jwt", token, {
        maxAge: 604800000,
        httpOnly: true,
        sameSite: true
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
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};
