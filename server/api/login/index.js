'use strict';

var express = require('express');
var passport = require('passport');

var router = express.Router();

// Respond to login request
router.post('/login', passport.authenticate('user', {failureRedirect: '/login'}), function(req,res) {
  res.send({user: req.user});
});

// Respond to login request
router.post('/adminLogin', passport.authenticate('admin', {failureRedirect: '/login#/admin'}), function(req,res) {
  res.send({user: req.user});
});

// Will pull the currently logged in user from the session
router.get('/loggedInUser', function(req, res) {
  res.send({user: req.user});
});

// This will logout the currently logged in user
router.get('/logoutUser', function(req, res) {
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
