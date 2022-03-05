const metascraper = require("metascraper")([
  require("metascraper-title")(),
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-logo")(),
  require("metascraper-clearbit")(),
  require("metascraper-publisher")(),
  require("metascraper-url")(),
  require("metascraper-author")(),
  require("metascraper-date")(),
]);
const got = require("got");

async function parseUrlMetascraper(targetUrl) {
  const { body: html, url } = await got(targetUrl);
  const metadata = await metascraper({ html, url });
  metadata.name = metadata.publisher;
  return metadata;
}

module.exports = {
  parseUrlMetascraper,
};
