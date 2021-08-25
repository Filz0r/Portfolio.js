const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Local imports
const { logger } = require("../controllers/logs");
const startup = require("../controllers/startup");

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.redirect("/startup");
});

router
  .get("/startup", (req, res) => {
    if (res.app.config === null || res.app.config === undefined) {
      res.render("admin/startup.ejs", {
        title: "Initial Configuration | PortfolioJS",
        lang: "eng",
      });
    } else {
      res.redirect(301, "/null");
    }
  })
  .post("/startup", upload.none(), async (req, res) => {
    const {
      password,
      confirmPassword,
      email,
      title,
      contactEmail,
      defaultLang,
      secondLang,
    } = req.body;
    const optLangs = new Array(secondLang);
    if (res.app.config === null || res.app.config === undefined) {
      const obj = {
        email,
        password,
        confirmPassword,
        title,
        contactEmail,
        defaultLang,
        optLangs,
      };
      return await startup(obj, req, res);
    } else {
      res.redirect(301, "/null");
    }
  });

module.exports = router;
