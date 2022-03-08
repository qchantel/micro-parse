import isEmail from "validator/lib/isEmail";
import { parseUrl } from "../metascraper/metascraper.js";

function extractDomainFromEmail(email) {
  const regex = /@(.*)/;
  return email.match(regex)[1];
}

export function getUrl(string) {
  let copy = string;
  if (isEmail(copy)) {
    return extractDomainFromEmail(copy);
  }

  copy = copy.replace(/(https|http):\/\//, "");

  if (copy.match(/.*\..*/)) {
    return copy;
  }

  throw {
    message:
      "An unknown error happened. It's often caused by misconfigured websites or robots protections.",
    status: 500,
  };
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
