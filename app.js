const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const routerIndex = require('./routes/index');

const { PORT, DATABASE_URL, NODE_ENV } = require('./config');
const { NotFoundError } = require('./errorsCatch/errorsCatch');
const { requestLogger, errorsLogger } = require('./middlewares/logger');

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use('', routerIndex);

app.all('/*', (req, res, next) => {
  const err = new NotFoundError('Запрашиваемый ресурс не найден');
  next(err);
});

app.use(errorsLogger);
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`NODE_ENV ${NODE_ENV}`);
});
