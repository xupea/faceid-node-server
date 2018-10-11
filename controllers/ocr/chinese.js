const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", function(req, res) {
  axios({
    method: "get",
    url: process.env.SIGNATURE_URL,
    headers: {
      "Content-Type": "application/json"
    }
  }).then(
    function(result) {
      const signature = result.data.data.signature;
      const objSign = {
        sign: signature,
        sign_version: "hmac_sha1",
        capture_image: 0,
        return_url: process.env.RETURN_URL_OCR,
        notify_url: process.env.NOTIFY_URL_OCR
      };
      axios({
        method: "post",
        url: process.env.BIZ_TOKEN_URL_OCR,
        data: objSign
      }).then(
        function(result) {
          const biz_token = result.data.biz_token;
          res.redirect(process.env.REDIRECT_URL_OCR + biz_token);
        },
        function(msg) {
          res.render("faceid_failure", {
            error_message: msg,
            title: "身份认证"
          });
        }
      );
    },
    function(msg) {
      res.render("genernal_error", {
        error_message: msg
      });
    }
  );
});

module.exports = router;
