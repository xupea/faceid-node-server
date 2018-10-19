const express = require("express");
const router = express.Router();

router.use("/faceid", require("./faceid"));
router.use("/ocr", require("./ocr"));
router.use("/market", require("./market"));

module.exports = router;
