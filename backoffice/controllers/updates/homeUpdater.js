// Imports
const configSchema = require("../../models/configSchema");
const homeSchema = require("../../models/homeSchema");
const { isURL, isEmail } = require("validator");
const {
  imageSorter,
  objectValidator,
  textSanitizer,
  objectSanitizer,
} = require("../utils");
const { obj } = require("../../assets/models");

// function that calls the rest of the functions in this file
// according to what kind of data is passed, formInfo is
// an hidden value inside the forms that are sent to the
// backend, a switch statement is created as a way to prevent
// someone changing the values of this hidden input in
// developer options on the browser if this happens, it
// runs the default statement, that just returns an error
async function homeUpdater(formInfo, res, req) {
  let fields;
  let result;
  // the user is needed, since the main page information is only one,
  // it has the same ObjectID as the configSchema that is created
  // when the website is first launched this reduces the
  // complexity of the config schema
  const { user } = req;
  switch (formInfo) {
    // Updating the intro section, that not only makes the top part of the
    // default page but also holds some other information like a favicon,
    // and in the future may hold other information
    case "intro":
      const { introTxt, language: introLang } = req.body;
      fields = [introTxt, introLang];
      // these functions sort out the object to be saved in the db
      const intro = await introBuilder(fields, req.files, user);
      // create a new object from the result of intro builder
      // if validate is true, only update the passed objects
      let introObj = {
        sanitized: intro.sanitized,
        raw: intro.sanitized,
        favicon: intro.icon,
        mainImg: intro.mainImg,
      };
      // remove all empty values from the created object
      introObj = objectSanitizer(introObj);
      // send that to the function that saves the data on the DB
      result = await saveOrEditToDB(
        introObj,
        intro.language,
        intro.validate,
        "intro",
        res
      );
      // return the result, that should be true if everything
      // went as expected, or what ever error happened this might be
      // a data validation error or an actual error when saving to the DB
      return result;
    // Updating the about section, this is the most simple of the 3 as
    // it only converts the input data into a simple object
    // that can be properly saved in the DB
    case "about":
      //  extracting  the values from the body
      const { aboutTxt, language: aboutLang } = req.body;
      // changing the fields variable to contain the form data
      fields = [aboutTxt, aboutLang];
      // send that to the about builder that converts the data
      // to HTML and checks if this needs to be
      // updated or created in the schema
      const about = await aboutBuilder(fields, user);
      // create the aboutObject and then send it to the saveOrEditToDB
      // function that sorts everything and saves again result should
      // always be either true or the value of the error that ocurred.
      const aboutObj = {
        sanitized: about.sanitized,
        raw: about.raw,
      };
      result = await saveOrEditToDB(
        aboutObj,
        about.language,
        about.validate,
        "about",
        res
      );
      return result;
    // The most trick of them all, mostly because I want to make sure
    // that only valid data is saved this should be the only one that
    // causes issues, and will probably need to be reworked in the future
    // this social section is where the user can save links to their
    // social media or linkedin/github pages and also save a contact
    // email that should be different from the login email,
    // for security reasons obviously.
    case "social":
      const { email, github, linkedin, facebook, instagram } = req.body;
      fields = { email, github, linkedin, facebook, instagram };
      const validate = objectValidator(user, "social");
      const socialObj = objectSanitizer(fields);
      result = await saveSocialToDB(socialObj, validate, res);
      return result;
    // Simple redirect to the admin page if formInfo is
    // not expected by the backend.
    default:
      req.flash("error", "It seems like someone is trying to break this!");
      return res.redirect("/admin");
  }
}
// Messy abstraction? Not sure how to explain this but fields
// are the fields that are passed are the actual values and
// fields that are passed from the POST request
async function introBuilder(fields, images, user) {
  let result;
  const sortedImages = await imageSorter(images);

  const text = textSanitizer(fields[0]);
  result = {
    sanitized: { [fields[1]]: text },
    raw: { [fields[1]]: fields[0] },
  };
  if (sortedImages !== false) {
    result.mainImg = sortedImages.filter(
      (img) => img.fieldname === "homeImage"
    );
    result.icon = sortedImages.filter((img) => img.fieldname === "favicon");
  }
  result.validate = objectValidator(user, "intro");
  result.language = fields[1];
  return result;
}
async function aboutBuilder(fields, user) {
  let result;
  const text = textSanitizer(fields[0]);
  result = {
    sanitized: { [fields[1]]: text },
    raw: { [fields[1]]: fields[0] },
  };
  result.validate = objectValidator(user, "about");
  result.language = fields[1];
  return result;
}

function socialValidator(obj) {
  let invalidEmail = String();
  let invalidLinks = Array();
  // convert the object in 2 different ones that can me modified
  const email = Object.assign({}, obj);
  const links = Object.assign({}, obj);
  // delete all the keys that are not email in the email object
  Object.keys(email).forEach((key) => {
    key !== "email" ? delete email[key] : {};
  });
  // delete all the keys that are email in the links object
  Object.keys(links).forEach((key) => {
    key === "email" ? delete links[key] : {};
  });
  // check if the value in the email object is a valid email
  Object.values(email).forEach((value) => {
    if (isEmail(value) === false) {
      invalidEmail = `${value} is not an valid email!`;
    }
  });
  Object.values(links).forEach((val) => {
    if (isURL(val) === false) {
      invalidLinks.push(val);
    }
  });

  // not sure if I should be doing this like this, but this is
  // what I came with to return a flexible error output
  const errors = { email: invalidEmail, links: invalidLinks };
  if (errors.email.length !== 0 && errors.links.length !== 0) {
    return `${invalidEmail}\r\nThe following links are not valid:\r\n${invalidLinks.join(
      "\r\n"
    )}`;
  } else if (errors.links.length !== 0 && errors.email.length === 0) {
    return `The following links are not valid:\r\n${invalidLinks.join("\r\n")}`;
  } else if (errors.email.length !== 0 && errors.links.length === 0) {
    return invalidEmail;
  } else {
    return true;
  }
}

// This function as the name suggests creates or edits the objects in the DB
async function saveOrEditToDB(objToSave, language, state, path, response) {
  const { user } = response.req;

  // state is extracted when creating/validating the data that is sent to the
  // backend server if this is true it means that the object needs to be updated
  if (state) {
    const home = await homeSchema.findById({ _id: user._id });
    let result = home[path];
    result.raw[language] = objToSave.raw[language];
    result.sanitized[language] = objToSave.sanitized[language];
    // since only the intro path has file inputs check for changes using it
    if (path === "intro") {
      if (objToSave["mainImg"] !== undefined) {
        result.mainImg = objToSave["mainImg"];
      }
      if (objToSave["favIcon"] !== undefined) {
        result.favicon = objToSave["favicon"];
      }
    }
    try {
      await homeSchema.findByIdAndUpdate(
        {
          _id: user._id,
        },
        {
          [path]: result,
        }
      );
      return true;
    } catch (e) {
      return `the following error occurred: ${e}`;
    }
  }
  await configSchema.findByIdAndUpdate(
    { _id: user._id },
    {
      [path]: true,
    }
  );
  // extract this in order to check if there is already a document on the DB
  const homeSchemaChecker = await homeSchema.findById({ _id: user._id });
  // if this value is null create a document if not just update it
  if (homeSchemaChecker === null) {
    await new homeSchema({
      _id: user._id,
      [path]: objToSave,
    }).save();
    return true;
  }
  await homeSchema.findByIdAndUpdate(
    { _id: user._id },
    {
      [path]: objToSave,
    }
  );
  return true;
}

async function saveSocialToDB(objToSave, state, response) {
  const { user } = response.req;
  const validArguments = socialValidator(objToSave);
  if (validArguments === true) {
    // 1- check for the state
    // 2- if state is true edit the object
    // 3- if not check if the entry exists in the db
    // 4- create/edit the object to be saved
    if (state) {
      // edit the object instead of creating
      const social = await homeSchema.findById({ _id: user._id });
      let result = social["social"];
      Object.keys(objToSave).forEach((key) => {
        if (key in result) {
          result[key] =
            result[key] !== objToSave[key] ? objToSave[key] : result[key];
        } else {
          result[key] = objToSave[key];
        }
      });
      try {
        await homeSchema.findByIdAndUpdate(
          { _id: user._id },
          {
            social: result,
          }
        );
        return true;
      } catch (e) {
        return `the following error occured: ${e}`
      }
    } else {
      await configSchema.findByIdAndUpdate(
        { _id: user._id },
        {
          social: true,
        }
      );
      // extract this in order to check if there is already a document on the DB
      const homeSchemaChecker = await homeSchema.findById({ _id: user._id });
      // if this value is null create a document if not just update it
      if (homeSchemaChecker === null) {
        await new homeSchema({
          _id: user._id,
          social: objToSave,
        }).save();
        return true;
      }
      await homeSchema.findByIdAndUpdate(
        { _id: user._id },
        {
          social: objToSave,
        }
      );

      return true;
    }
  } else {
    return validArguments;
  }
}

module.exports = { homeUpdater };

/*// These 2 constants are what validate the objects if they don't return
    // true then the DB will not be updated, this is in order to make sure
    // only valid information is stored in the DB, not sure if this works
    // properly, but I sure hope so.
    const emailCheck = emailValidator(objToSave);
    const linkCheck = linkValidator(objToSave);
    // Why separate this in 2 nested if statements?
    // Again to make sure that nothing that is not valid is saved in the DB
    // the email check may be false but the link check true, this way I hope
    // that the user always knows what went wrong
    if (emailCheck !== true) {
      if (linkCheck !== true) {
        return `${emailCheck}\n${linkCheck}`;
      }
      return emailCheck;
    }
    if (linkCheck !== true) {
      if (emailCheck !== true) {
        return `${emailCheck}\n${linkCheck}`;
      }
      return linkCheck;
    }
    // when this object was not introduced update the configSchema
    if (!state) {
      await configSchema.findByIdAndUpdate(
        { _id: user._id },
        {
          [path]: true,
        }
      );
    }
    if (emailCheck === true && linkCheck === true) {
      try {
        await homeSchema.findByIdAndUpdate(
          {
            _id: user._id,
          },
          {
            social: objToSave,
          }
        );
        return true;
      } catch (e) {
        return `the following error occurred: ${e}`;
      }
    }*/
