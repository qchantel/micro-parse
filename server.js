"use strict";
import routes from "./controllers/index.js";
import express from "express";

console.log("starting server");

// WARNING: do not put middleware and specific configurations here as it's not included in e2e testing

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
const app = express();
app.get("/", (req, res) => {
  res.send("<code>This is informatron.xyz api 🔍. Working fine. </code>");
});

app.use("/api", routes);
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
