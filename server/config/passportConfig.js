var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {

  app.use(passport.initialize()); // Initialize passport with the application
  app.use(passport.session()); // Essentially turn on using Session

  // Verify user Login
  passport.use('user', new LocalStrategy(
    function(username, password, done) {

      // Check that there is a user match in the 'DB'
      verifyUser(username, password, function(user) {

        // Match found
        if(user.id) {
          return done(null, user);
        } else { // No match return error
          return done(null, false);
        }
      });
    }
  ));

  // Verify Admin Login
  passport.use('admin', new LocalStrategy(
    function(username, password, done) {

      // Check that there is a admin match in the 'DB'
      verifyAdmin(username, password, function(user) {

        // Match found
        if(user.id) {
          return done(null, user);
        } else { // No match return error
          return done(null, false);
        }
      });
    }
  ));

  // Serialize the User to the session just save the ID and the role
  passport.serializeUser(function(user, done) {
    done(null, {id: user.id, role: user.role});
  });

  // Deserialize the user from the Session based on ID and role
  passport.deserializeUser(function(user, done) {
    switch(user.role) {
      case 'user':
        // Query user from DB
        getUser(user.id, function(user) {
          done(null, user);
        });
        break;
      case 'admin':
        // Query Administrator from DB
        getAdmin(user.id, function(user) {
          done(null, user);
        });
        break;
    }
  });
}


// Dummy function simulate DB call
function verifyUser(username, password, callback) {

  if(username == 'username' && password === 'password') {
      callback({
        id: 1,
        username: "username",
        email: "dummy@fake.com",
        role: 'user'
      });
  } else {
    callback({});
  }
}

// Dummy function simulate DB call
function verifyAdmin(username, password, callback) {

  if(username == 'admin' && password === 'admin') {
    callback({
      id: 1,
      username: "admin",
      email: "admin@fake.com",
      role: 'admin'
    });
  } else {
    callback({});
  }
}

// Dummy function simulate DB call
function getUser(id, callback) {
  callback({
    id: 1,
    username: "username",
    email: "dummy@fake.com",
    role: 'user'
  });
}

// Dummy function simulate DB call
function getAdmin(id, callback) {
  callback({
    id: 1,
    username: "admin",
    email: "admin@fake.com",
    role: 'admin'
  });
}
