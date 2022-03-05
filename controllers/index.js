const express = require("express");
const { parseUrlOrEmail } = require("../services/html-parser/html-parser");
const router = express.Router();

// Get all posts
router.use(express.json());

router.get("/", async (req, res) => {
  res.send("Hello world, api is working properly");
});

router.post("/", async (req, res, next) => {
  try {
    const { body } = req;

    if (!body || !Object.keys(body).length) {
      throw {
        status: 400,
        message: "Missing POST body, check the documentation for examples.",
      };
    }

    const { urlOrEmail } = body;
    const data = await parseUrlOrEmail(urlOrEmail);

    res.send(data);
  } catch (e) {
    next(e);
  }
});

// error handler, format shall be {status: [httpStatus: number], message: [error message: string]}
router.use(function (err, req, res, next) {
  res
    .status(err.status || 500)
    .json({ status: err.status, message: err.message });
});

module.exports = router;
