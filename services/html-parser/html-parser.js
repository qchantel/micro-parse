import isEmail from "validator/lib/isEmail";
import { parseUrl } from "../metascraper/metascraper.js";

function extractDomainFromEmail(email) {
  const regex = /@(.*)/;
  return email.match(regex)[1];
}

export function getUrl(string) {
  if (isEmail(string)) {
    return extractDomainFromEmail(string);
  }

  if (string.match(/http/)) {
    // string.replace(/http.*\/\//, "");
    throw {
      status: 400,
      message: "Do not include http:// or https:// in your query",
    };
  }

  if (string.match(/.*\..*/)) {
    console.log(string);
    return string;
  }

  throw { message: "Malformed payload", status: 400 };
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
