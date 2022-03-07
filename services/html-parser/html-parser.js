import { isEmail, isURLLL } from "../../helpers/validators.js";

// These lines make "require" available
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

// const isEmail = require("validator/lib/isEmail");
// const isUrl = require("validator/lib/isUrl");

// import validator from "validator/index.js";

// if (!isEmail || !isUrl) {
//   const { isEmail, isUrl } = validator;
// }
import { parseUrl } from "../metascraper/metascraper.js";

function extractDomainFromEmail(email) {
  const regex = /@(.*)/;
  return email.match(regex)[1];
}

export function getUrl(string) {
  if (isEmail(string)) {
    return extractDomainFromEmail(string);
  }

  if (isURLLL(string)) {
    return string;
  }

  throw new Error(
    "Be sure to pass a valid URL or e-mail. Example: 'example.com' or 'johnny@example.com'"
  );
}

export async function parseUrlOrEmail(input = "") {
  if (typeof input !== "string") {
    throw new Error("The URL or e-mail you provided is not a string.");
  }
  const url = getUrl(input);

  try {
    const data = await parseUrl(url);
    return data;
  } catch (e) {
    throw e;
  }
}
