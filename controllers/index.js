const express = require("express");
const router = express.Router();

router.use("/faceid", require("./faceid"));
router.use("/ocr", require("./ocr"));

module.exports = router;
