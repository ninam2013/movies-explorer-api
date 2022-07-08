const router = require('express').Router();
const { validationsCreateMovies, validationsDeleteMovies } = require('../middlewares/validations');
const {
  getMovies,
  createMovies,
  deleteMovies,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', validationsCreateMovies, createMovies);

router.delete('/:_id', validationsDeleteMovies, deleteMovies);

module.exports = router;
