const axios = require('axios')
const https = require('https')
const fs = require('fs')
const config = async (app) => {
    let config;
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false, // (NOTE: this will disable client verification)
        cert: fs.readFileSync("./server.cert"),
        key: fs.readFileSync("./server.key"),
    })
    await axios.get(`${process.env.ADMIN_URI}config`, { httpsAgent }).then(response => {
        config = response.data
        if (response.data.length === 0) {
            config = undefined
            return config
        }
    })
    return config
}

const configChecker = () => {
    return (req, res) => {
        if (req.app.config === undefined || req.app.config === null) {
            if (req.headers.host.includes('localhost')) {
                return res.redirect(`${process.env.ADMIN_URI}/admin/startup`)
            } else {
                return res.redirect(`https://${req.headers.host}/admin/startup`)
            }
        }
        else {
            console.log('handle the else idiot')
            // console.log(req)
        }
    }
}

module.exports = { config, configChecker }

