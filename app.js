require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { signUp, signIn } = require('./middlewares/validations');
const users = require('./routes/users');
const movies = require('./routes/movies');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, DATABASE, DEFAULT_ALLOWED_METHODS } = require('./util/constants');
const { handleAllErrors } = require('./middlewares/handleAllErrors');

const app = express();

mongoose.connect(DATABASE, { useNewUrlParser: true });

app.use(express.json());

// добавляем поддержку CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  return next();
});

// подключаем логгер запросов перед всеми обработчиками
app.use(requestLogger);

// добавляем обработчики роутов
app.post('/signup', signUp, createUser);
app.post('/signin', signIn, login);

app.use('/users', auth, users);
app.use('/movies', auth, movies);

// запрос к несуществующему роуту
app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

// подключаем логгер ошибок после всех обработчиков
app.use(errorLogger);

// обработчики ошибок предварительной валидации (celebrate)
app.use(errors());

// централизованная обработка ошибок
app.use(handleAllErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
