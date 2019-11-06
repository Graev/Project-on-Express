const routerUsers = require('express').Router();
const path = require('path');
const fs = require('fs');

routerUsers.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '..', 'data', 'users.json'), { encoding: 'utf8' }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send(JSON.parse(data));
  });
});

routerUsers.get('/:id', (req, res) => {
  fs.readFile(path.join(__dirname, '..', 'data', 'users.json'), { encoding: 'utf8' }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const user = JSON.parse(data).filter((i) => {
      if (i._id == req.params.id) {
        return true;
      }
      return false;
    });

    if (user.length === 0) {
      res.send({ "message": "Нет пользователя с таким id" });
      return;
    }
    res.send(user);
  });
});

module.exports = routerUsers;
