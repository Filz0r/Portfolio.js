const express = require("express");
const { logger } = require("../../controllers/logs");

//models
const Skill = require("../../models/plugins/skillSchema");

//middleware
const { checkAuthenticated } = require("../../controllers/AuthController");
const { saveSkillAndRedirect } = require("../../controllers/admin.js");
const router = express.Router();

router.get("/", checkAuthenticated, async (req, res) => {
  try {
    const skill = await Skill.find();
    res.status(200).render("admin/skills", {
      user: req.user,
      title: "Add skills | Filipe Figueiredo",
      skill: skill,
    });
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

router.post("/", checkAuthenticated, async (req, res, next) => {
    try {
      req.skill = new Skill();
      next();
    } catch (e) {
      logger.error(e);
      res.status(400).redirect("/null");
    }
  },
  saveSkillAndRedirect()
);

module.exports = router;
