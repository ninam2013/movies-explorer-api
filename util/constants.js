const PORT = process.env.PORT || 3000;
const DATABASE = 'mongodb://localhost:27017/bitfilmsdb';
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  PORT,
  DATABASE,
  DEFAULT_ALLOWED_METHODS,
};
