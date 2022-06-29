// импортируем модель
const Movie = require('../models/movie');
// импортируем ошибки
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getMovies = (_, res, next) => {
  // все фильмы
  Movie.find({})
    .then((movies) => res.send({ movies }))
    .catch(next);
};

const createMovies = (req, res, next) => {
  // создаём карточку фильма
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  // записываем в константу неверные значения
  const wrongVariables = !country || !director
    || !duration || !year
    || !description || !image
    || !trailerLink || !nameRU
    || !nameEN || !thumbnail || !movieId;
  // записываем в константу строку id пользователя
  const owner = req.user._id;
  if (wrongVariables || !owner) {
    next(new BadRequestError('Переданы некорректные данные'));
  }
  // создаём карточку
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    // вернём записанные в базу данные
    .then((movie) => res.send({ data: movie }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const deleteMovies = (req, res, next) => {
  // находим карточку по _id
  console.log('req.params-delete===', req.params);
  Movie.findOne({ _id: req.params._id })
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильм не найден'));
      }
      if (req.user._id !== movie.owner.toString()) {
        return next(new ForbiddenError('Нет прав на удаление'));
      }
      // удаляем карточку по _id
      console.log('req.params===', req.params);
      return Movie.findByIdAndRemove(req.params._id)
        .then((movieData) => {
          res.send({ movieData });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovies,
  deleteMovies,
};
