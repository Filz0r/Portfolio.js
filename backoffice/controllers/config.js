const fs = require('fs')
const path = require('path')

const config = (app) => {
  const configPath = path.resolve(__dirname, '../config.json')
  if (fs.existsSync(configPath)) {
    const data = fs.readFileSync(configPath)
    const { title, contactEmail:email, defaultLang, optionalLanguages } = JSON.parse(data)
    app.config = {
      title,
      email,
      defaultLang,
      optionalLanguages
    }
    return true
  } else {
    return false
  }
}

module.exports = config