// импортируем модуль jsonwebtoken для создания токена
const jwt = require('jsonwebtoken');
// импортируем bcrypt для создания хеша
const bcrypt = require('bcryptjs');
// импортируем модель
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

// импортируем ошибки
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

// создание пользователя
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10)
    // создаём пользователя
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    // вернём записанные в базу данные
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
    }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные обновления пользователя или профиля'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Такой пользователь есть в базе данных'));
      }
      return next(err);
    });
};

// возвращаем информацию о пользователе
const returnProfile = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send({ data: user });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  // обнавляем данные пользователя по _id
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Такой пользователь есть в базе данных'));
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные обновления пользователя или профиля'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  // возвращаем метод findUserByCredentials проверки почты и пароля
  User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! создадим токен. Для этого вызовем метод jwt.sign с 3 аргументами
      // 1.пайлоад 2.секретный ключ(соль) 3.время действия токена
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // если всё хорошо возвращаем токен
      res.send({ token });
    })
    .catch(() => {
      // если что-то пошло не так
      next(new UnauthorizedError('Неверная авторизация'));
    });
};

module.exports = {
  createUser,
  returnProfile,
  updateProfile,
  login,
};
