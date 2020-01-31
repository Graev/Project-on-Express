/* eslint-disable no-unused-vars */
const express = require('express');
// require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const routerIndex = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { PORT, DATABASE_URL } = require('./config');
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

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string().required(),
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      about: Joi.string()
        .required()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .required()
        .domain(),
    }),
  }),
  createUser
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.use(auth);

app.use('/', routerIndex);

app.all('/*', (req, res) => {
  const err = new NotFoundError('Запрашиваемый ресурс не найден');
  // eslint-disable-next-line no-undef
  next(err);
});

app.use(errorsLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
