const express = require("express");
const { logger } = require("../../controllers/logs");
const bcrypt = require("bcrypt");
//models
const Admin = require("../../models/configSchema");

//middleware
const { checkAuthenticated } = require("../../controllers/AuthController");

const router = express.Router();

router.get("/", checkAuthenticated, async (req, res) => {
  try {
    const path = req.originalUrl;
    res.status(200).render("admin/account.ejs", {
      user: req.user,
      path: path,
      title: "Account | Filipe Figueiredo",
    });
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

router.post("/", checkAuthenticated, async (req, res) => {
  const admin = await Admin.find();
  const { oldPW, newPW, cNewPW } = req.body;
  const password = admin[0].password;
  if (await bcrypt.compare(oldPW, password)) {
    if (newPW !== cNewPW) {
      req.flash("message", "The passwords don't match!");
      res.redirect("/admin/account/");
    } else if (newPW.length < 8) {
      req.flash("message", "The password must have at least 8 characthers!");
      res.redirect("/admin/account/");
    } else {
      const hashedPW = await bcrypt.hash(newPW, 10);
      await Admin.findOneAndUpdate(
        { email: admin[0].email },
        {
          password: hashedPW,
        }
      );
      req.flash("message", "Password Changed!");
      res.redirect("/admin/eng");
    }
  } else {
      req.flash("message", "Password Changed!");
      res.redirect("/admin/eng");
  }
});

module.exports = router;
