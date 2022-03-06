"use strict";

import { toRule } from "@metascraper/helpers";

const cssRule = (value, opts) => value;

const metascrapFilesCustom = (opts) => {
  const toCss = toRule(cssRule, opts);

  return {
    files: [
      toCss(($, url) => {
        const res = $("script").get()[0].attribs["src"];
        const slicedUrl = url.slice(0, url.length - 1);

        const links = $("link")
          .get()
          .map((elem) => {
            const fileName = elem.attribs["href"];
            if (fileName && fileName[0] === "/") {
              return slicedUrl + fileName;
            } else if (
              fileName &&
              !fileName.includes("://") &&
              !fileName.includes("www.")
            ) {
              return url + fileName;
            }

            // if (fileName.includes(".css")) console.log(fileName);
            return fileName;
          });
        const scripts = $("script")
          .get()
          .map((elem) => {
            const fileName = elem.attribs["src"];
            if (fileName && fileName[0] === "/") return slicedUrl + fileName;
            // if (fileName.includes(".css")) console.log(fileName);
            return fileName;
          })
          .filter((e) => e);
        // const styles = $("body").get().attribs["style"];
        // .forEach((elem) => {
        //   console.log(elem.attr("style"));
        // });
        // console.log(styles);
        return links.concat(scripts);
        // return styles;
      }),
    ],
  };
};

export default metascrapFilesCustom;
