const routerUsers = require('express').Router();
const path = require('path');
const userJSON = require(path.join(__dirname, '..', 'data', 'users.json'));

routerUsers.get('/', (req, res) => {
  res.send(userJSON);
});

routerUsers.get('/:id', (req, res) => {
  const user = userJSON.find((i) => i._id === req.params.id);

  if (user === undefined) {
    res.send({ "message": "Нет пользователя с таким id" });
    return;
  }
  res.send(user);
});

module.exports = routerUsers;
