const mongoose = require('mongoose');
const { obj } = require('../assets/models');

const homeSchema = new mongoose.Schema({
  intro: obj,
  about: obj,
  social: obj,
});

module.exports = mongoose.model('home', homeSchema);
