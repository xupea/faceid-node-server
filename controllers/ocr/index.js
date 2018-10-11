const express = require("express");
const router = express.Router();

router.use("/chinese", require("./chinese"));
router.use("/notify", require("./notify"));
router.use("/return", require("./return"));

module.exports = router;
