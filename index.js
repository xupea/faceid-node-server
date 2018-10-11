const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

const signature_url =
  "http://120.79.193.99:5000/user_account/v1/user/user_face_sign";
const biz_token_url = "https://openapi.faceid.com/lite/v1/get_biz_token";
const ocr_biz_token_url =
  "https://openapi.faceid.com/lite_ocr/v1/get_biz_token";
const redirect_url = "https://openapi.faceid.com/lite/v1/do/";
const ocr_redirect_url = "https://openapi.faceid.com/lite_ocr/v1/do/";

// for heroku
// const return_url = "https://faceid-node-server.herokuapp.com/return";
// const notify_url = "https://faceid-node-server.herokuapp.com/notify";
// const ocr_return_url = "https://faceid-node-server.herokuapp.com/return_ocr";
// const ocr_notify_url = "https://faceid-node-server.herokuapp.com/notify_ocr";

// for ali cloud
// const return_url = "http://120.79.193.99:9022/return";
// const notify_url = "http://120.79.193.99:9022/notify";
// const ocr_return_url = "http://120.79.193.99:9022/return_ocr";
// const ocr_notify_url = "http://120.79.193.99:9022/notify_ocr";

// for local testing
const return_url = "http://localhost:11000/return";
const notify_url = "http://localhost:11000/notify";
const ocr_return_url = "http://localhost:11000/return_ocr";
const ocr_notify_url = "http://localhost:11000/notify_ocr";

const get_result_url = "https://openapi.faceid.com/lite/v1/get_result";
const ocr_get_result_url = "https://openapi.faceid.com/lite_ocr/v1/get_result";

function handleChineseID(req, res) {
  console.log("handle chinese id and sending get request to " + signature_url);
  axios({
    method: "get",
    url: signature_url,
    headers: {
      "Content-Type": "application/json"
    }
  }).then(
    function(result) {
      const signature = result.data.data.signature;
      console.log("signature : " + signature);
      const objSign = {
        sign: signature,
        sign_version: "hmac_sha1",
        capture_image: 1,
        return_url: ocr_return_url,
        notify_url: ocr_notify_url
      };
      console.log("sending post request to " + ocr_biz_token_url);
      axios({
        method: "post",
        url: ocr_biz_token_url,
        data: objSign
      }).then(
        function(result) {
          console.log("biz_token for ocr : " + result.data.biz_token);
          const biz_token = result.data.biz_token;
          res.redirect(ocr_redirect_url + biz_token);
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
}
/* 
 * 1. get signature first
 * 2. get biz token
 * 3. get final url and redirect
*/
function handleChineseFaceID(req, res) {
  console.log("sending get request to " + signature_url);
  const idcard_name = req.query.idcard_name;
  const idcard_number = req.query.idcard_number;
  axios({
    method: "get",
    url: signature_url,
    headers: {
      "Content-Type": "application/json"
    }
  }).then(
    function(result) {
      const signature = result.data.data.signature;
      console.log("signature : " + signature);
      const objSign = {
        sign: signature,
        sign_version: "hmac_sha1",
        return_url: return_url,
        notify_url: notify_url,
        comparison_type: 0,
        liveness_type: "video_number",
        idcard_name,
        idcard_number,
        group: 0,
        image_ref1: ""
      };
      console.log("sending post request to " + biz_token_url);
      axios({
        method: "post",
        url: biz_token_url,
        data: objSign
      })
        .then(
          function(result) {
            console.log("biz_token for face id : " + result.data.biz_token);
            const biz_token = result.data.biz_token;
            res.redirect(redirect_url + biz_token);
          },
          function(msg) {
            res.render("genernal_error", {
              error_message: msg.response.data.error
            });
          }
        )
        .catch(error => {
          console.log(error);
        });
    },
    function(msg) {
      res.render("genernal_error", {
        error_message: msg
      });
    }
  );
}

function handleForeignerFaceID(req, res) {}

function handleReturn(req, res) {
  const biz_token = req.query.biz_token;

  axios({
    method: "get",
    url: signature_url,
    headers: {
      "Content-Type": "application/json"
    }
  }).then(
    function(result) {
      const sign = result.data.data.signature;
      const sign_version = "hmac_sha1";
      const need_image = 1;

      // check the result info
      axios({
        method: "get",
        url: `${get_result_url}?sign=${sign}&sign_version=${sign_version}&biz_token=${biz_token}&need_image=${need_image}`
      }).then(
        function(result) {
          const status = result.data.result_message;
          if (status === "USER_CANCEL") {
            console.log("cancel");
            res.render("faceid_failure", {
              error_message: "用户主动取消了高级验证流程",
              title: "高级验证"
            });
          } else {
            res.render("faceid_success", {
              title: "高级认证"
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
}

// handle id verification return url
function handleReturnOCR(req, res) {
  const biz_token = req.query.biz_token;

  axios({
    method: "get",
    url: signature_url,
    headers: {
      "Content-Type": "application/json"
    }
  }).then(
    function(result) {
      const sign = result.data.data.signature;
      const sign_version = "hmac_sha1";
      const need_image = 1;

      // check the result info
      axios({
        method: "get",
        url: `${ocr_get_result_url}?sign=${sign}&sign_version=${sign_version}&biz_token=${biz_token}&need_image=${need_image}`
      }).then(
        function(result) {
          const status = result.data.result_message;
          if (status === "USER_CANCEL") {
            res.render("faceid_failure", {
              error_message: "用户主动取消了验证流程",
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
}

function handleNotify(req, res) {
  console.log(
    "biz_token from post for notify url : " + req.body.data.biz_token
  );
  console.log("error from post for notify url : " + req.body.data.error);
  res.end("yes");
}

function handleNotifyOCR(req, res) {
  console.log(
    "biz_token from post for notify url : " + req.body.data.biz_token
  );
  console.log("error from post for notify url : " + req.body.data.error);
  res.end("yes");
}

app.set("views", __dirname + "/views/");
app.set("view engine", "jade");

// chinese id verification
app.get("/faceid_ocr", handleChineseID);

// chinese face id
app.get("/faceid_chinese", handleChineseFaceID);

// foreigner face image compare
app.get("/faceid_foreigner", handleForeignerFaceID);

// the url for return_url of faceid
app.get("/return", handleReturn);

// the url for return_url of faceid
app.get("/return_ocr", handleReturnOCR);

// the url for notify_url of faceid
app.post("/notify", handleNotify);

// the url for notify_url of faceid
app.post("/notify_ocr", handleNotifyOCR);

// please change the port accordingly
const port = process.env.PORT || 11000;

app.listen(port, () => console.log("face id server hosts on " + port));
