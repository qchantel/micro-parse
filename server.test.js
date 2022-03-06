import supertest from "supertest";
import createServer from "./services/server/httpServer.js";

beforeEach((done) => {
  done();
});

afterEach((done) => {
  done();
});

const app = createServer();

describe("e2e testing", () => {
  describe("GET /api/domain/infos", () => {
    test("HTTP with permission denied", async () => {
      await supertest(app).get(`/api/domain/infos/`).expect(403);
    });

    test("Shall error for missing body", async () => {
      await supertest(app)
        .get(`/api/domain/infos/`)
        .set("X-RapidAPI-Proxy-Secret", "testvalue")
        .expect(400);
    });
    test("Shall work and contain a body", async () => {
      const urlOrEmail = "stackoverflow.com";
      await supertest(app)
        .get(`/api/domain/infos/${urlOrEmail}`)
        .set("X-RapidAPI-Proxy-Secret", "testvalue")
        .expect(200)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
        });
    }, 10000);
    test("Shall work and contain a body", async () => {
      const urlOrEmail = "capsa.finance";
      await supertest(app)
        .get(`/api/domain/infos/${urlOrEmail}`)
        .set("X-RapidAPI-Proxy-Secret", "testvalue")
        .expect(200)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
        });
    }, 10000);
    test("Shall work and contain a body", async () => {
      const urlOrEmail = "notice.studio";
      await supertest(app)
        .get(`/api/domain/infos/${urlOrEmail}`)
        .set("X-RapidAPI-Proxy-Secret", "testvalue")
        .expect(200)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
        });
    }, 10000);
    test("Shall work and contain a body", async () => {
      const urlOrEmail = "pikomit.com";
      await supertest(app)
        .get(`/api/domain/infos/${urlOrEmail}`)
        .set("X-RapidAPI-Proxy-Secret", "testvalue")
        .expect(200)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
        });
    }, 10000);
  });
});
