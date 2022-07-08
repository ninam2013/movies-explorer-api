const router = require('express').Router();
const { validationReturnProfile, validationsUpdateProfile } = require('../middlewares/validations');
const {
  returnProfile,
  updateProfile,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/me', validationReturnProfile, returnProfile);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', validationsUpdateProfile, updateProfile);

module.exports = router;
