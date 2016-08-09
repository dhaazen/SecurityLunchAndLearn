var helmet = require('helmet');
var config = require('./environment');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

// Handles security aspects
module.exports = function(app) {

  // Parse the body of the request
  app.use(bodyParser.json({
    type: ['json', 'application/csp-report']
  }));

  // We're running locally
  if(!process.env.VCAP_SERVICES) {

    // No requirement on secure cookie
    app.use(cookieSession({
        secret: config.secrets.session,
        httpOnly: true
    }));

  } else { // On Bluemix

    app.set('trust proxy', 1) // trust first proxy

    // Homegrown middleware to redirect to HTTPS
    app.use(requireHTTPS);

    app.use(cookieSession({
        secret: config.secrets.session,
        secure: true,
        secureProxy: true,
        httpOnly: true
    }));
  }

  // Remove powered by express header
  app.disable('x-powered-by');
  app.use(helmet.ieNoOpen()); // Some IE security bug
  app.use(helmet.noSniff()); // MIME Type sniffing by browsers can be exploited
  app.use(helmet.noCache()); // Don't cache old code
  app.use(helmet.xssFilter());

  // Used to prevent clickjacking
  app.use(helmet.frameguard({ action: 'deny' }));

  // CSP enabling for XSS Prevention
  app.use(helmet.contentSecurityPolicy({
    // Specify directives as normal.
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc: ['fonts.gstatic.com'],
      sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
      reportUri: '/report-violation',
      objectSrc: [] // An empty array allows nothing through
    },

    reportOnly: false,
    setAllHeaders: false,
    disableAndroid: false,
    browserSniff: true
  }));
}

// Homegrown middleware to redirect application to HTTPS
function requireHTTPS(req, res, next) {

  // Proxy sets $wsis for requests as a flag of HTTP
  if (req.headers && req.headers.$wsis === 'false') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}
