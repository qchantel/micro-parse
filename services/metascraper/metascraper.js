const metascraperFiles = require("./custom-rules/metascraper-files");
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
  require("metascraper-lang")(),
  require("metascraper-logo-favicon")(),
  require("metascraper-manifest")(),
  metascraperFiles(),

  // require("metascraper-address")(),
]);
const got = require("got");
// const { parseCss } = require("../css-parser/css-parser");
const { checkMemoryUsage } = require("../../helpers/inspector");
const { findImageColor } = require("../image-parser/image-parser");

async function getAllCssFiles(cssFiles) {
  // TODO: add limiter size
  let allCss = "";
  const values = await Promise.all(
    cssFiles.map((cssFile) => {
      return got(cssFile);
    })
  );
  if (values.length === 0) return;
  values.forEach((value) => (allCss += value.body));
  return allCss;
}

async function parseUrl(targetUrl) {
  try {
    let palette = null;
    let html = null;
    let url = null;
    let warningMessage = null;
    let cssFilesPalette = null;

    try {
      const gotHtmlRes = await got(targetUrl);
      html = gotHtmlRes.body;
      url = gotHtmlRes.url;
    } catch (e) {
      html = e.body;
      url = e.url;
      warningMessage = `${targetUrl} is protected against robots, you are getting limited results.`;
    }
    const metaData = await parseUrlMetascraper(html, url);

    // try {
    //   const allCss = await getAllCssFiles(cssFiles);

    //   cssFilesPalette = allCss ? parseCss(allCss, html) : null;
    // } catch (e) {
    //   console.error(e);
    // }

    try {
      palette = await findImageColor(metaData);
    } catch (e) {
      console.error(e);
    }

    checkMemoryUsage();
    const data = { ...metaData, palette };
    // console.log(data);
    if (warningMessage) {
      data.warningMessage = warningMessage;
    }
    return data;
  } catch (e) {
    throw (
      e || { message: "Something went wront while fetching data", status: 500 }
    );
  }
}

async function parseUrlMetascraper(html, url) {
  const metadata = await metascraper({ html, url });
  metadata.name = metadata.publisher;

  return metadata;
}

module.exports = {
  parseUrl,
};
