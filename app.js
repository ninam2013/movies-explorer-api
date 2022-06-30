const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const movies = require('./routes/movies');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();
// присоединяем к localhost:27017
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', { useNewUrlParser: true });

app.use(express.json());

// добавляем обработчики
app.post('/signup', createUser);
app.post('/signin', login);

app.use('/users', auth, users);
app.use('/movies', auth, movies);

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
