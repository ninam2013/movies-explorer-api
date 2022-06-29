const router = require('express').Router();
const {
  returnProfile,
  updateProfile,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/me', returnProfile);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', updateProfile);

module.exports = router;
