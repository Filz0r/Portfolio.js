const slugify = require('slugify');
const { logger } = require('./logs');

const mimeTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];

function saveProjectAndRedirect(path, lang) {
  return async (req, res) => {
    const pagePath = req.baseUrl;
    let project = req.project;
    project.title = req.body.title;
    project.description = req.body.description;
    project.markdown = req.body.markdown;
    project.published = req.body.published == 'on' ? true : false;
    project.github = req.body.github == '' ? 'None' : req.body.github;
    project.link = req.body.link == '' ? 'None' : req.body.link;
    if (path == 'new') {
      const cover = req.files.cover;
      const fileExt = cover.mimetype.slice(6, cover.mimetype.length);
      cover.name = `${slugify(req.body.title, {
        lower: true,
        strict: true,
      })}.${fileExt}`;
      project.cover = cover.name;
      const uploadPath = `public/images/covers/${cover.name}`;
      if (mimeTypes.includes(cover.mimetype)) {
        cover.mv(uploadPath, async (err) => {
          if (err) {
            throw err;
          } else {
            try {
              project = await project.save();
              res.redirect(`/admin/${lang}/projects/${project.slug}`);
            } catch (e) {
              logger.error(e);
              res.render(`projects/${path}`, {
                user: req.user,
                project: project,
              });
            }
          }
        });
      } else {
        req.flash('msg', 'The file must be an image! (jpeg, gif, png or svg)');
        res.render(`projects/${path}`, {
          user: req.user,
          project: project,
          path: pagePath,
          title: 'New Project | FilipeDev',
        });
      }
    } else {
      try {
        project = await project.save();
        res.redirect(`/admin/${lang}/projects/${project.slug}`, 200, {
          user: req.user,
          path: pagePath,
          title: `${project.title} | FilipeDev`,
        });
      } catch (e) {
        logger.error(e);
        res.status(400).render(`projects/${path}`, {
          user: req.user,
          project: project,
          path: pagePath,
          title: 'Error saving project | FilipeDev',
        });
      }
    }
  };
}

function saveSkillAndRedirect() {
  return async (req, res) => {
    let skill = req.skill;
    skill.category = req.body.category;
    skill.name = req.body.name;
    const logo = req.files.logo;
    logo.name = `${slugify(req.body.name, {
      lower: true,
      strict: true,
    })}.svg`;
    const path = `public/images/logos/${logo.name}`;
    skill.path = logo.name;
    if (logo.mimetype != 'image/svg+xml') {
      try {
        req.flash('message', 'The file must be an svg!');
        res.redirect('/admin/skills', 400, {
          user: req.user,
          skill: skill,
          title: 'New Skill | FilipeDev',
        });
      } catch (e) {
        logger.error(e);
        res.redirect('/null');
      }
    } else {
      try {
        logo.mv(path, async (err) => {
          skill = await skill.save();
          res.redirect('/admin');
        });
      } catch (e) {
        logger.error(e);
        res.redirect('/null');
      }
    }
  };
}

function saveAboutAndRedirect(lang) {
  return async (req, res) => {
    let about = req.about;
    about.description = req.body.description;
    about.about = req.body.about;
    about.skills = req.body.skills;
    about.skillBag = req.body.skill;
    try {
      about = await about.save();
      res.redirect(`/admin/${lang}/`, 200, {
        user: req.user,
        about: about,
        title: `About | FilipeDev`,
      });
    } catch (e) {
      logger.error(e);
      res.status(400).render(`/admin`, {
        user: req.user,
        about: about,
        title: 'Error saving main page | FilipeDev',
      });
    }
  };
}
module.exports = {
  saveProjectAndRedirect,
  saveSkillAndRedirect,
  saveAboutAndRedirect,
};
