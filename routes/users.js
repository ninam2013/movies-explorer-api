const router = require('express').Router();
const {
  returnProfile,
  updateProfile,
} = require('../controllers/users');

router.get('/me', returnProfile);

router.patch('/me', updateProfile);

module.exports = router;
