const express = require("express");
const passport = require('passport')
const { logger } = require("../../controllers/logs");

//middleware
const { checkNotAuthenticated, checkAuthenticated } = require("../../controllers/AuthController");

const router = express.Router();

//handles the login
router.get("/", checkNotAuthenticated, (req, res) => {
    try {
      const path = req.originalUrl;
      res
        .status(200)
        .render("admin/login.ejs", {
          user: req.user,
          path: path,
          title: "Administration Login | Filipe Figueiredo",
        });
    } catch (e) {
      logger.error(e);
      res.status(400).redirect("/null");
    }
});

router.post("/",  (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/admin/en",
      failureFlash: true ,
      failureRedirect: "/admin/login",
      
    })(req, res, next);
});

module.exports = router;
