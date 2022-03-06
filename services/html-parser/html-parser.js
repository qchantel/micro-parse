import isEmail from "validator/lib/isEmail.js";
import isUrl from "validator/lib/isUrl.js";

import { parseUrl } from "../metascraper/metascraper.js";

function extractDomainFromEmail(email) {
  const regex = /@(.*)/;
  return email.match(regex)[1];
}

export function getUrl(string) {
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
