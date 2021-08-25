require("dotenv").config();
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan")
const expressLayouts = require("express-ejs-layouts");
const compression = require("compression");

const app = express();
// local modules
const { logger } = require("./controllers/logs");
const { config } = require('./controllers/config')
require("./controllers/database")

// Headers
app.all("/", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
// Settings
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.json())
app.use(compression());

app.use('/', require('./routes/router'))
let init;
(async () => {
    init = await config(app)
    app.config = init
})();
app.get('/admin', (req,res) => {
    res.redirect(process.env.ADMIN_URI)
})

app.get("/null", (req, res) => {
    res
        .status(400)
        .render("errors/400", { user: req.user, title: "Bad Request | FilipeDev" });
});

app.use((req, res) => {
    res
        .status(404)
        .render("errors/404", { user: req.user, title: "Not found | FilipeDev" });
});
// Logging
app.use(
    morgan("dev", {
        skip: function (req, res) {
            return res.statusCode < 400;
        },
    })
);
app.use(
    morgan("combined", {
        stream: fs.createWriteStream(path.join(__dirname, "/logs/access.log"), {
            flags: "a",
        }),
    })
);
https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
},
    app).listen(process.env.PORT || 3500, (err) => {
        if (err) {
            return logger.error(err);
        } else {
            logger.info(`connected on port ${process.env.PORT || 3500}`);
        }
    });