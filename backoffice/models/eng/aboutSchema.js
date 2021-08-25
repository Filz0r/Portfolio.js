const mongoose = require("mongoose");
const marked = require("marked");
const createDomPurifier = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurifier(new JSDOM().window);

const reqString = {
  type: String,
  required: true,
};
const aboutSchema = new mongoose.Schema({
  description: reqString,
  sanitizedDesc: reqString,
  about: reqString,
  sanitizedAbout: reqString,
  skills: reqString,
  sanitizedSkills: reqString,
  skillBag: {
    type: Array,
    required: true
  }
});

aboutSchema.pre("validate", function (next) {
  if (this.description && this.skills && this.about) {
    this.sanitizedDesc = dompurify.sanitize(marked(this.description));
    this.sanitizedSkills = dompurify.sanitize(marked(this.skills));
    this.sanitizedAbout = dompurify.sanitize(marked(this.about));
  }
  next();
});

module.exports = mongoose.model("about", aboutSchema);
