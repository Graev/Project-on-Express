const router = require('express').Router();
const routerUsers = require('./users');
const routerCards = require('./cards');
const {
  validateSignup,
  validateSignin,
} = require('../validator/requestValidation');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);

router.use(auth);

router.use('/users', routerUsers);
router.use('/cards', routerCards);

module.exports = router;
