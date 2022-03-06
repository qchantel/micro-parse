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
    test("Shall work and contain a body", async () => {
      const payload = { urlOrEmail: "https://crisp.chat/en/" };
      await supertest(app)
        .post("/api/")
        .send(payload)
        .expect(200)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
        });
    }, 10000);
  });
});
