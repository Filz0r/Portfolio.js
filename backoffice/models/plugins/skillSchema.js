const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};
const skillSchema = new mongoose.Schema({
    category: reqString,
    name: reqString,
    img: {
      data: Buffer,
      contentType: String
    },
});

module.exports = mongoose.model("skills", skillSchema);
