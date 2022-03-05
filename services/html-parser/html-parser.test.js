const { parseUrlOrEmail, getUrl } = require("./html-parser");

describe("getUrl()", () => {
  test("shall throw error for malformed url", () => {
    expect(() => getUrl("https://jdsajdas")).toThrow();
  });

  test("shall throw error for malformed email", () => {
    expect(() => getUrl("jdsajdas@lala")).toThrow();
  });

  test("shall return the correct domain when passing an email", () => {
    expect(getUrl("contact@notice.studio")).toBe("notice.studio");
  });
});

describe("parseUrlOrEmail()", () => {
  test("shall throw error for non-string input", async () => {
    expect.assertions(1);
    return parseUrlOrEmail(32).catch((e) => expect(e).toBeInstanceOf(Object));
  });

  test("shall return an object containing a title", async () => {
    const data = await parseUrlOrEmail("notice.studio");
    expect(data).toHaveProperty("title", expect.any(String));
  });
});
