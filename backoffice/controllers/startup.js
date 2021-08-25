const configSchema = require('../models/configSchema');
const { isEmail, isStrongPassword, equals } = require('validator');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const startup = async (obj, req, res) => {
  // start by handling all the possible exceptions, it works, but the intended output is
  // to have each error in a separate line, but this does not work right now
  // but a possible solution is to send an object to EJS and then use EJS to make it work
  // like intended, will try to implement this in an later release.
  const errors = Array();
  if (!isEmail(obj.email)) {
    errors.push('The provided email is not valid!');
  }
  if (!equals(obj.confirmPassword, obj.password)) {
    errors.push('The passwords do not match!');
  }
  if (!isStrongPassword(obj.password)) {
    errors.push('The password is not strong!');
  }
  if (errors.length > 0) {
    errToReturn = `The following errors happened:\n${errors.join('\n')}`;
    req.flash('error', errToReturn);
    return res.redirect(301, '/admin/startup');
  }
  // Deconstructing the object that is created on the front end
  // and also creating the config object that is after saved in the config.json file
  const {
    password,
    email,
    title,
    contactEmail,
    defaultLang: defaultLanguage,
    optLangs: optionalLanguages,
  } = obj;
  const config = {
    title,
    defaultLang: defaultLanguage,
    contactEmail,
    optionalLanguages,
  };
  // Hashing the PW before saving in the DB
  const hashedPW = await bcrypt.hash(password, 10);
  // save the config on the db and create the config.json file
  const newConf = await new configSchema({
    password: hashedPW,
    email,
    title,
    contactEmail,
    defaultLanguage,
    optionalLanguages,
  }).save();
  // create empty schemas that are used to build the final objects
  const conf_JSON = JSON.stringify(config);
  fs.writeFileSync(
    (configPath = path.resolve(__dirname, '../config.json')),
    conf_JSON,
    (err) => {
      if (err) throw err;
    }
  );
  res.redirect('/admin/login');
  return process.exit();
};

module.exports = startup;
