require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const compression = require('compression');
const https = require('https');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const cors = require('cors');
// local modules
const { logger } = require('./controllers/logs');
const init = require('./controllers/passport');
const config = require('./controllers/config');
require('./controllers/database');

const app = express();
const api = express();
// Headers
app.all('/', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});
// Logging56
app.use(
  morgan('dev', {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);
app.use(
  morgan('combined', {
    stream: fs.createWriteStream(path.join(__dirname, '/logs/access.log'), {
      flags: 'a',
    }),
  })
);
// Settings
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(compression());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser(process.env.SECRET));
app.use(flash());
app.use(methodOverride('_method'));
app.use(cors());
// passport session options
const sessionOptions = {
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_PATH }),
  name: 'someVariableGoesHere',
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 },
  secure: true,
  sameSite: true,
};
// Making passport work in production, I think?
app.use(require('express-session')(sessionOptions));
app.set('trust proxy', 1);
app.use(session(sessionOptions));
app.use(passport.initialize(init(passport)));
app.use(passport.session());
// local variable to pass messages, mostly errors
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

const appInit = config(app);
if (!appInit) {
  app.use('/', require('./routes/startup'));
  app.use('/admin', require('./routes/startup'));
} else {
  app.get('/', (req, res) => {
    res.redirect('/admin');
  });
  app.get('/config', (req, res) => {
    res.json(app.config);
  });
  if (process.env.PUBLIC_API === 'true') {
    app.get('/api', (req, res) => {
      res.redirect('http://localhost:3501');
    });
  } else {
    app.use('/api', api);
    logger.warn(
      'API is exposed in /api!\nBe careful using this with self signed certificates.\n'
    );
  }

  app.use('/admin', require('./routes/admin'));
}

api.use('/', require('./routes/api'));
//error handlers
// When creating dynamic routes, if the requested route does not exist, you can
// handle that by sending this to the default bad request page, theres examples
// on how to do that in the pre defined routes.
app.get('/null', (req, res) => {
  res.status(400).render('errors/400', {
    user: req.user,
    title: 'Bad Request | PortfolioJS',
    lang: 'eng',
  });
});

app.use((req, res) => {
  res.status(404).render('errors/404', {
    user: req.user,
    title: 'Not found | PortfolioJS',
    lang: 'eng',
  });
});

// Creating the server, most likely I will create a docker container that generates the
// self signed certificate and key for it to be used, removing the need for people
// to provide their own certs.
api.listen(3501, (err) => {
  if (err) {
    return logger.error(err);
  } else {
    logger.info('API listening on port 3501');
  }
});
console.log();
https
  .createServer(
    {
      key: fs.readFileSync(
        process.env.KEY === undefined ? 'server.key' : process.env.KEY
      ),
      cert: fs.readFileSync(
        process.env.CERT === undefined ? 'server.cert' : process.env.CERT
      ),
    },
    app
  )
  .listen(process.env.PORT || 3500, (err) => {
    if (err) {
      return logger.error(err);
    } else {
      logger.info(`Backoffice listening on port ${process.env.PORT || 3500}`);
    }
  });
