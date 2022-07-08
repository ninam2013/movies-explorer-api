const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// описываем схему
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => {
        validator.isEmail(v);
      },
      message: 'Невалидный email!',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// добавим метод findUserByCredentials с двумя параметрами почта и пароль
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте и скрываем пароль
  return this.findOne({ email }).select('+password')
    .then((user) => {
      // если не нашёлся email
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // если нашёлся email сравниваем пароль и хеш из базы
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          // если при сравнении хеши разные выводим ошибку
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          // если совпадают хеши, возвращаем переменную user
          return user;
        });
    });
};

// создаём модель
module.exports = mongoose.model('user', userSchema);
