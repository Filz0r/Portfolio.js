const { Router } = require('express');
const passport = require('passport');
const multer = require('multer');
const { logger } = require('../controllers/logs');
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require('../controllers/auth');
const { getLangs } = require('../controllers/language');
const { updateSorter } = require('../controllers/updates');

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});
const upload = multer({ storage: storage });

router
  .get('/', checkAuthenticated, async (req, res) => {
    const langs = getLangs(res.app.config);
    res.render('admin/admin', {
      user: req.user,
      title: `Backoffice | ${req.app.config.title}`,
      lang: req.app.config.defaultLang,
      langs,
    });
  })
  .post(
    '/home',
    upload.any(),
    checkAuthenticated,
    (req, res, next) => {
      next();
    },
    updateSorter('home')
  );

router
  .get('/login', checkNotAuthenticated, async (req, res) => {
    try {
      const path = req.originalUrl;
      res.status(200).render('admin/login.ejs', {
        user: req.user,
        path: path,
        title: 'Login | PortfolioJS',
        lang: req.app.config.defaultLang,
      });
    } catch (e) {
      logger.error(e);
      res.status(400).redirect('/null');
    }
  })
  .post('/login', upload.none(), (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/admin',
      failureFlash: true,
      failureRedirect: '/admin/login',
    })(req, res, next);
  });

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/admin/login');
});

module.exports = router;
