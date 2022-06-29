const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const movies = require('./routes/movies');

const { PORT = 3000 } = process.env;
const app = express();
// присоединяем к localhost:27017
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', { useNewUrlParser: true });

app.use(express.json());

// временный id
app.use((req, res, next) => {
  req.user = {
    _id: '62bc3e70d9b75b43551ef29d',
  };
  next();
});

// добавляем обработчики
app.use('/users', users);
app.use('/movies', movies);

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
