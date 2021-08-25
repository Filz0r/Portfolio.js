const express = require("express");
const { logger } = require("../../controllers/logs");

//middleware
const { checkAuthenticated, checkNotAuthenticated } = require("../../controllers/AuthController");

const router = express.Router();

//nested routers
router.use("/login", require("./login"));
router.use("/account", require("./account"));
router.use("/en", require("./eng"));
router.use("/pt", require("./pt"));
router.use("/skills", require("./skills"));

//Base Router that redirects allways to the english backoffice
/*router.get("/", checkNotAuthenticated, (req, res) => {
  try {
    res.status(302).redirect("/admin/en/");
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});*/

//uncomment the following block to be able to register a admin user
//Comment again to stop users from creating admin users (RECOMENDED)
//If you don't uncoment anyone can access the backoffice and mess with your website!
/*const bcrypt = require('bcrypt');
const User = require("../../models/adminSchema");

router.get('/register', (req, res) => {
    const path = req.originalUrl
    res.render('admin/register.ejs', {path: path, title: "register", user: req.user})
})
router.post('/register',  async (req, res) => {
    const { email, password } = req.body
    try {
        const hashedPw = await bcrypt.hash(password, 10)
        User.findOne({ email: email }).then((user) => {
            if (user) {
                req.flash('message', 'that email already exists')
                res.redirect('./register')
            } else {
                new User({
                    email: email,
                    password: hashedPw,
                }).save().then(user => {
                    req.flash('message', 'you are now registered')
                    res.redirect('./login')
                })
            }
        })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }

})
*/
module.exports = router;
