// импортируем модель
const User = require('../models/user');

// импортируем ошибки
const BadRequestError = require('../errors/BadRequestError');
// const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
// const ConflictError = require('../errors/ConflictError');

// возвращаем информацию о пользователе
const returnProfile = (req, res, next) => {
  // console.log('req-controllers===', req.user._id);
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
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные обновления пользователя или профиля'));
      }
      return next(err);
    });
};

module.exports = {
  returnProfile,
  updateProfile,
};
