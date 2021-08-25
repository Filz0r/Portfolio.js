const string = {
  type: Object,
  required: false,
};

const reqString = {
  type: String,
  required: true,
};
const reqObj = {
  type: Object,
  required: true,
};
const obj = {
  type: Object,
  required: false,
};

const reqArray = {
  type: Array,
  required: true,
};

const arr = {
  type: Array,
  required: false,
};

const reqBoolean = {
  type: Boolean,
  required: true,
};

const bool = {
  type: Boolean,
  required: false,
};

module.exports = {
  string,
  reqString,
  reqObj,
  reqArray,
  arr,
  obj,
  reqBoolean,
  bool,
};
