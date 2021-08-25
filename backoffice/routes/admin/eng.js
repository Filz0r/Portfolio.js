const express = require("express");
const { logger } = require("../../controllers/logs");

//models
const Project = require("../../models/eng/projectSchema");
const About = require("../../models/eng/aboutSchema");
const Skill = require("../../models/plugins/skillSchema");

//middleware
const { checkAuthenticated } = require("../../controllers/AuthController");
const {
  saveProjectAndRedirect,
  saveAboutAndRedirect,
} = require("../../controllers/admin.js");

const router = express.Router();

//Handles the homepage actions
router.get("/", checkAuthenticated, async (req, res) => {
  try {
    const path = req.originalUrl;
    const skills = await Skill.find();
    const about = await About.find();
  
    res.status(200).render("admin/admin.ejs", {
      user: req.user,
      path: path,
      about: about.length !== 1 ? new About() : about[0],
      skills: skills,
      title: "Administration | FilipeDev",
    });
    console.log(about)
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

router.post(
  "/",
  checkAuthenticated,
  async (req, res, next) => {
    try {
      await About.deleteMany();
      logger.info("Data purged proceeding to update");
    } catch (e) {
      logger.error(e);
    }
    req.about = new About();
    next();
  },
  saveAboutAndRedirect("en")
);

//handles the project actions
router.get("/projects", checkAuthenticated, async (req, res) => {
  try {
    const path = req.originalUrl;
    const projects = await Project.find().sort({ createdAt: "desc" });
    res.status(200).render("projects/index", {
      user: req.user,
      projects: projects,
      title: "Admin Projects | FilipeDev",
      path,
    });
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

router.get("/projects/new", checkAuthenticated, async (req, res) => {
  try {
    const path = req.originalUrl;
    res.status(200).render("projects/new", {
      user: req.user,
      project: new Project(),
      title: "New Project | FilipeDev",
      path: path,
    });
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

//this has a issue, if I don't give a github link the  link will literally be none 
//a ternary operator somewhere on the front-end or in here if that happens, this also happens
//on the user front-end, but throws no error because it redirects directly to a bad request page
//But still if the slug == "none" the links should not appear on the project page
router.get("/projects/:slug", checkAuthenticated, async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (project == null) res.status(400).redirect("/projects");
    res.status(200).render("projects/show", {
      user: req.user,
      project: project,
      title: `${project.title} | FilipeDev`,
    });
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

router.get("/projects/edit/:id", checkAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const path = req.baseUrl;
    res.status(200).render("projects/edit", {
      user: req.user,
      project: project,
      path: path,
      title: `Edit: ${project.title} | FilipeDev`,
    });
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

router.post(
  "/projects/new",
  checkAuthenticated,
  async (req, res, next) => {
    req.project = new Project();
    next();
  },
  saveProjectAndRedirect("new", "en")
);

router.put(
  "/projects/edit/:id/",
  checkAuthenticated,
  async (req, res, next) => {
    req.project = await Project.findById(req.params.id);
    res.status(302);
    next();
  },
  saveProjectAndRedirect("edit", "en")
);

router.delete("/projects/:id", checkAuthenticated, async (req, res) => {
  try {
    await Project.findOneAndDelete(req.params.id);
    res.status(200).redirect("/admin/en/projects");
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

module.exports = router;
