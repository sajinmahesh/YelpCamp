const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../helpers/catchAsync');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');

router.get('/register', (req, res) => {
  res.render('user/register');
});
router.post(
  '/register',
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash('success', 'welcome to campground');
        res.redirect('/campgrounds');
      });
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('/register');
    }
  })
);

router.get('/login', (req, res) => {
  res.render('user/login');
});
router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.flash('success', 'welcome back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);
router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'goodbye');
    res.redirect('/campgrounds');
  });
});
module.exports = router;
