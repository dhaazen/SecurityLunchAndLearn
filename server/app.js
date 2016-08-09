var express = require('express');
var cfenv = require('cfenv');
var http = require('http');
var path = require('path');

// Environment Config variables
var config = require('./config/environment');

// Setup server
var app = express();
var server = http.createServer(app);

// Configure Security Settings
require('./config/securityConfig')(app);

//Configure Passport Strategies
require('./config/passportConfig')(app);

//Statically serve up necessary files
app.use('/node_modules', express.static(path.join(config.root, '/node_modules')));
app.use('/client', express.static(path.join(config.root, '/client')));

// Serve up routes
require('./routes')(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
