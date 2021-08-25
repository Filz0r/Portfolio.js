const fs = require('fs');
const marked = require('marked');
const createDomPurifier = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurifier(new JSDOM().window);

// grabs the passed images and creates an array with the mimetype,
// the fieldname and the binary buffer for the image
async function imageSorter(images) {
  if (images.length > 0) {
    const result = [];
    images.forEach((image) => {
      const tempObject = {
        mimetype: image.mimetype,
        data: fs.readFileSync(image.path),
        fieldname: image.fieldname,
      };
      result.push(tempObject);
    });
    return result;
  }
  return false;
}
// checks if the property to be saved exists in the user object
function objectValidator(user, info) {
  if (user[info] === undefined) {
    return false;
  }
  return true;
}
// converts an sanitizes markdown, plain text and HTML to safe HTML
function textSanitizer(text) {
  const result = dompurify.sanitize(marked(text));
  return result;
}
// deletes the undefined/empty values of an object
function objectSanitizer(obj) {
  Object.keys(obj).forEach((key) =>
    obj[key] === undefined || obj[key] === '' ? delete obj[key] : {}
  );
  return obj;
}

module.exports = {
  imageSorter,
  objectValidator,
  textSanitizer,
  objectSanitizer,
};
