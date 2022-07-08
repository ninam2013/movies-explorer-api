const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validationsUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Поле с URL заполнено некорректно');
};

const signUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().pattern(/[А-Яа-яA-Za-z0-9]/).required().min(2)
      .max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationReturnProfile = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});

const validationsUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

const validationsCreateMovies = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validationsUrl),
    trailerLink: Joi.string().required().custom(validationsUrl),
    thumbnail: Joi.string().required().custom(validationsUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validationsDeleteMovies = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  signUp,
  signIn,
  validationReturnProfile,
  validationsUpdateProfile,
  validationsCreateMovies,
  validationsDeleteMovies,
};
