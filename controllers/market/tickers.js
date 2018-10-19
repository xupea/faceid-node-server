const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", function(req, res) {
  axios({
    method: "get",
    url: process.env.HUOBI_MARKET_TICKERS,
    headers: {
      "Content-Type": "application/json"
    }
  }).then(
    function(result) {
      res.send(result.data);
    },
    function(error) {
      res.send(error);
    }
  );
});

module.exports = router;
