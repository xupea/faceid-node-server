const express = require("express");
const router = express.Router();

router.use("/chinese", require("./chinese"));
router.use("/foreigner", require("./foreigner"));
router.use("/notify", require("./notify"));
router.use("/return", require("./return"));

module.exports = router;
