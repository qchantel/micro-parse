import express from "express";
import { parseUrlOrEmail } from "../services/html-parser/html-parser.js";
const router = express.Router();

// Get all posts
router.use(express.json());

router.use((req, res, next) => {
  const auth =
    req.headers["X-RapidAPI-Proxy-Secret"] ||
    req.headers["x-rapidapi-proxy-secret"];
  console.log(req.headers);
  if (!auth) throw { status: 403, message: "Permission denied" };
  console.log(auth);
  next();
});
router.get("/domain/infos/:urlOrEmail?", async (req, res, next) => {
  try {
    const { params } = req;
    if (!params || !params.urlOrEmail) {
      throw {
        status: 400,
        message: "Missing POST body, check the documentation for examples.",
      };
    }
    const { urlOrEmail } = params;
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

export default router;
