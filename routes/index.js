var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const users = [];

const initializePassport = require('../passport-config');
const passport = require('passport');
const { config } = require('../node_modules/dotenv/types/tsconfig.json');
initializePassport(passport, 
  email => users.find(user => user.email === email), 
  id => users.find(user => user.id === id)
);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true 
}))

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/register', async function(req, res, next) {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login');
  } catch {
    res.redirect('/register')
  }
  console.log(users);
});


module.exports = router;
