/**
 * Main application routes
 */

'use strict';

var config = require('./config/environment');
var auth = require('./auth');

module.exports = function(app) {

  // API Routes
  app.use('/api', require('./api/login'));

  // Application serving routes
  app.get('/login', function(req, res){
    res.sendFile(config.root + '/client/loginApp/index.html');
  });

  // Secured Routes
  app.get('/userPortal', auth.verifyUser, function(req, res){
    res.sendFile(config.root + '/client/userApp/index.html');
  });

  app.get('/adminPortal', auth.verifyAdmin, function(req, res){
    res.sendFile(config.root + '/client/adminApp/index.html');
  });

  app.post('/report-violation', function (req, res) {

    if (req.body) {
      // Angular will fail eval check however it internally has a workaround reduces speed but enhances security
      // silence this logging
      if(req.body['csp-report']['source-file'] !== 'https://' + req.headers.host + '/node_modules/angular/angular.min.js' &&
         req.body['csp-report']['source-file'] !== 'http://' + req.headers.host + '/node_modules/angular/angular.min.js') {
        console.log('CSP Violation: ', req.body)
      }
    } else {
      console.log('CSP Violation: No data received!')
    }
    res.status(204).end()
  })
}
