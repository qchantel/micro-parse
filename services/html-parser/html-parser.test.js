import { parseUrlOrEmail, getUrl } from "./html-parser.js";

describe("getUrl()", () => {
  test("shall throw error for malformed url", () => {
    return expect(() => getUrl("https://jdsajdas")).toThrow();
  });

  test("shall throw error for malformed email", () => {
    return expect(() => getUrl("jdsajdas@lala")).toThrow();
  });

  test("shall return the correct domain when passing an email", () => {
    return expect(getUrl("contact@notice.studio")).toBe("notice.studio");
  });

  test("shall work by replacing http", async () => {
    return expect(getUrl("https://apple.com")).toBe("apple.com");
  });
});

describe("parseUrlOrEmail()", () => {
  test("shall throw error for non-string input", async () => {
    expect.assertions(1);
    return parseUrlOrEmail(32).catch((e) => expect(e).toBeInstanceOf(Object));
  });

  test("shall throw because too many redirects", async () => {
    parseUrlOrEmail("carrefour.fr").catch((e) => {
      return expect(e).toBeInstanceOf(Object);
    });
  });

  test("shall return an object containing a title", async () => {
    const data = await parseUrlOrEmail("notice.studio");
    expect(data).toHaveProperty("title", expect.any(String));
  });
});
