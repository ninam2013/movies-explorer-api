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

const { PORT = 3000 } = process.env;
const app = express();
// присоединяем к localhost:27017
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', { useNewUrlParser: true });

app.use(express.json());

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
app.use('*', (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'На сервере произошла ошибка.';
  res.status(status).send({
    err,
    message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
