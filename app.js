const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
// const movies = require('./routes/movies');

const { PORT = 3000 } = process.env;
const app = express();
// присоединяем к localhost:27017
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', { useNewUrlParser: true });

// добавляем авторизацию
app.use('/users', users);
// app.use('/movies', movies);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
