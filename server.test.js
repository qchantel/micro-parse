const supertest = require("supertest");
const createServer = require("./services/server/httpServer");

beforeEach((done) => {
  done();
});

afterEach((done) => {
  done();
});

const app = createServer();

describe("e2e testing", () => {
  test("GET /api/", async () => {
    await supertest(app).get("/api/").expect(200);
  });
  describe("POST /api/domain-infos", () => {
    test("Shall error for missing body", async () => {
      const payload = {};
      await supertest(app).post("/api/").send(payload).expect(400);
    });
    test("Shall work and return an object", async () => {
      const payload = { urlOrEmail: "contact@notice.studio" };
      await supertest(app)
        .post("/api/")
        .send(payload)
        .expect(200)
        .then(async ({ body }) => {
          console.log(body);
          expect(body).toBe(expect.any(Object));
        });
    }, 10000);
  });
});