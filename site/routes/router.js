const express = require("express");
const { configChecker } = require("../controllers/config");
const { logger } = require("../controllers/logs");
const router = express.Router();

router.get("/", async (req, res, next) => {
    if (res.app.config !== undefined) {
    res.redirect(`/${res.app.config.defaultLang}`)
    } else {
        next()
    }
}, configChecker());

router.get('/projects', async (req, res, next) => {
    if (res.app.config !== undefined) {
    res.redirect(`/${res.app.config.defaultLang}/projects`)
    } else {
        next()
    }
}, configChecker());

router.get('/:lang', (req, res) => {
    res.status(200).json(`homepage in ${req.params.lang}`);
})

router.get("/:lang/projects", async (req, res) => {
    res.status(200).json(`projects in ${req.params.lang}`);
});
module.exports = router;