'use strict';

module.exports = {
  // Verifies the User matches the role or it will redirect
  verifyUser: function(req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'user') {
      return next();
    } else {
      res.redirect('/login');
    }
  },
  // Verifies the admin matches the role or it will redirect
  verifyAdmin: function(req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'admin') {
      return next(); // Passes Auth check continue on
    } else {
      res.redirect('/login#/admin');
    }
  }
}
