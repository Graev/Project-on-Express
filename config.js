const JWT_TOKEN =
  process.env.JWT_TOKEN ||
  'ea4d7d87d193658e6c08c5500e0e984b3102a6cf3a77f4678fff714eb75b023f';
const PORT = 3000;
const DATABASE_URL =
  process.env.SERVER_URL || 'mongodb://localhost:27017/mestodb';

const { NODE_ENV } = process.env;

module.exports = { JWT_TOKEN, PORT, DATABASE_URL, NODE_ENV };
