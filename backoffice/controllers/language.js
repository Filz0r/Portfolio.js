function getLangs(config) {
  const { defaultLang: defLang, optionalLanguages: optLang } = config;
  if (optLang.includes(defLang)) return optLang;
  optLang.unshift(defLang);
  const result = optLang;
  return result;
}

async function setLanguage(path) {
  const language = path;
  const langString = language.toString();
  return langString;
}

module.exports = { getLangs, setLanguage };
