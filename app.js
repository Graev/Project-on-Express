const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '5dd40b74877dc8c3e26aa703',
  };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.get('/*', (req, res) => {
  res.status(404).send({ "message": "Запрашиваемый ресурс не найден" });
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
