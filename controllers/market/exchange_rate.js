const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/:base/:quote", function(req, res) {
  const { base, quote } = req.params;
  axios({
    method: "get",
    url: `${process.env.COIN_API_EXCHANGE_RATE +
      base +
      "/" +
      quote +
      "?apikey=B3A0B6A9-F49C-4C04-A6A8-3DD3D0860D8C"}`,
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
