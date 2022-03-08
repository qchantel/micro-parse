"use strict";
import routes from "./controllers/index.js";
import express from "express";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message:
    "Too many requests. To use informatron in production please check our RapidAPI: https://rapidapi.com/quentin-ASRUWyU5m/api/informatron-logo-colors-and-infos-scraper/",
});

// WARNING: do not put middleware and specific configurations here as it's not included in e2e testing
// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
const app = express();
app.set("trust proxy");

app.use("/api", routes);
app.use(express.static("public"));

app.get("/ip", (request, response) => {
  response.send(request.ip + request.headers["x-forwarded-for"]);
});

app.use("/test", limiter);
app.use("/test", (req, res, next) => {
  // inject fake headers auth
  req.headers["X-RapidAPI-Proxy-Secret"] = "test";

  routes(req, res, next);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
