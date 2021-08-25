const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { reqString, arr, string, bool } = require('../assets/models');

const configSchema = new mongoose.Schema({
  email: reqString,
  password: reqString,
  defaultLanguage: reqString,
  activePlugins: arr,
  installedPlugins: arr,
  contactEmail: string,
  title: reqString,
  optionalLanguages: arr,
  about: bool,
  social: bool,
  intro: bool,
});
configSchema.plugin(passportLocalMongoose, {
  usernameField: this.email,
  usernameUnique: false,
});
module.exports = mongoose.model('config', configSchema);
