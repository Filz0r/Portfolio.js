const { homeUpdater } = require('./updates/homeUpdater');
function updateSorter(path) {
  return async (req, res) => {
    switch (path) {
      case 'home':
        const { formInfo } = req.body;
        const homeUpdates = await homeUpdater(formInfo, res, req);
        if (homeUpdates === true) {
          req.flash('success', 'The homepage was updated!');
          res.redirect('/admin');
        } else {
          req.flash('error', `${homeUpdates}`);
          res.redirect('/admin');
        }
        break;

      default:
        req.flash('error', 'There was an error!');
        res.redirect('/admin');
        break;
    }
  };
}

module.exports = { updateSorter };
