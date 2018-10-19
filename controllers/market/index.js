const express = require("express");
const router = express.Router();

router.use("/tickers", require("./tickers"));
router.use("/exchange_rate", require("./exchange_rate"));
// router.use("/favorite", require("./favorite"));

module.exports = router;
