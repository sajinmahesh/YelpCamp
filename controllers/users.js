const User = require('../models/user');
module.exports.renderRegister = (req, res) => {
  res.render('user/register');
};
module.exports.register = async (req, res, next) => {
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
};
module.exports.renderLogin = (req, res) => {
  res.render('user/login');
};
module.exports.login = (req, res) => {
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  req.flash('success', 'welcome back');
  res.redirect(redirectUrl);
};
module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'goodbye');
    res.redirect('/campgrounds');
  });
};
