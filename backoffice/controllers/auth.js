async function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You need to login to access this page!");
    res.redirect("/admin/login");
  }
}

async function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/admin/en");
  } else {
    next();
  }
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
};
