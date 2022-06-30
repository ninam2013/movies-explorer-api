const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  returnProfile,
  updateProfile,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/me', returnProfile);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
  }),
}), updateProfile);

module.exports = router;
