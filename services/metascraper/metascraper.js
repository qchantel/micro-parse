import metascraperFiles from "./custom-rules/metascraper-files.js";
import got from "got";

import metaorigin from "metascraper";
import title from "metascraper-title";
import description from "metascraper-description";
import image from "metascraper-image";
import logo from "metascraper-logo";
import clearbit from "metascraper-clearbit";
import publisher from "metascraper-publisher";
import metaurl from "metascraper-url";
import author from "metascraper-author";
import metadate from "metascraper-date";
import metalang from "metascraper-lang";
import metafavicon from "metascraper-logo-favicon";
import metanifest from "metascraper-manifest";

const metascraper = metaorigin([
  title(),
  description(),
  image(),
  logo(),
  clearbit(),
  publisher(),
  metaurl(),
  author(),
  metadate(),
  metalang(),
  metafavicon(),
  metanifest(),
  metascraperFiles(),
]);

// metascraper([
//   import("metascraper-title")(),
//   import("metascraper-description")(),
//   import("metascraper-image")(),
//   import("metascraper-logo")(),
//   import("metascraper-clearbit")(),
//   import("metascraper-publisher")(),
//   import("metascraper-url")(),
//   import("metascraper-author")(),
//   import("metascraper-date")(),
//   import("metascraper-lang")(),
//   import("metascraper-logo-favicon")(),
//   import("metascraper-manifest")(),
//   metascraperFiles(),
// ]);
// const { parseCss } = require("../css-parser/css-parser");
import { checkMemoryUsage } from "../../helpers/inspector.js";
import { findImageColor } from "../image-parser/image-parser.js";

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

export async function parseUrl(targetUrl) {
  try {
    let palette = null;
    let html = null;
    let url = null;
    let warningMessage = null;
    let cssFilesPalette = null;

    try {
      const gotHtmlRes = await got("https://" + targetUrl);
      html = gotHtmlRes.body;
      url = gotHtmlRes.url;
    } catch (e) {
      console.error(e);
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
    console.log(data);
    return data;
  } catch (e) {
    throw (
      e || { message: "Something went wront while fetching data", status: 500 }
    );
  }
}

async function parseUrlMetascraper(html, url) {
  let metadata = {};

  const metascrapData = await metascraper({ html, url });
  metadata = { ...metascrapData };
  metadata.name = metadata.publisher;

  return metadata;
}
