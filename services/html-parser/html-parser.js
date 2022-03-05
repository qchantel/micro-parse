const isEmail = require("validator/lib/isEmail");
const isUrl = require("validator/lib/isUrl");
const { parseUrlMetascraper } = require("../metascraper/metascraper");

function extractDomainFromEmail(email) {
  const regex = /@(.*)/;
  return email.match(regex)[1];
}

function getUrl(string) {
  if (isEmail(string)) {
    return extractDomainFromEmail(string);
  }

  if (isUrl(string)) {
    return string;
  }

  throw new Error(
    "Be sure to pass a valid URL or e-mail. Example: 'example.com' or 'johnny@example.com'"
  );
}

async function parseUrlOrEmail(input = "") {
  if (typeof input !== "string") {
    throw new Error("The URL or e-mail you provided is not a string.");
  }
  const url = getUrl(input);

  try {
    const data = await parseUrlMetascraper(url);
    return data;
  } catch (e) {
    next(e);
  }
  throw { status: 500, message: "Server error while parsing" };
}

module.exports = {
  parseUrlOrEmail,
  getUrl,
};