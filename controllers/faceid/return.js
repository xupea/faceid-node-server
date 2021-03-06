const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", function(req, res) {
  const biz_token = req.query.biz_token;

  axios({
    method: "get",
    url: process.env.SIGNATURE_URL,
    headers: {
      "Content-Type": "application/json"
    }
  }).then(
    function(result) {
      const sign = result.data.data.signature;
      const sign_version = "hmac_sha1";
      const need_image = 1;
      axios({
        method: "get",
        url: `${
          process.env.GET_RESULT_URL_FACEID
        }?sign=${sign}&sign_version=${sign_version}&biz_token=${biz_token}&need_image=${need_image}`
      }).then(
        function(result) {
          const status = result.data.result_message;
          if (status === "USER_CANCEL") {
            res.render("faceid_failure", {
              error_message: "用户主动取消了身份验证流程",
              title: "身份认证"
            });
          } else {
            res.render("faceid_success", {
              title: "身份认证"
            });
          }
        },
        function(msg) {
          res.render("genernal_error", {
            error_message: msg
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
