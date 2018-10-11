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
const redirect_url = "https://openapi.faceid.com/lite/v1/do/";
const return_url = "https://faceid-node-server.herokuapp.com/return";
const notify_url = "https://faceid-node-server.herokuapp.com/notify";
// const return_url = "http://120.79.193.99:9022/return";
// const notify_url = "http://120.79.193.99:9022/notify";
const get_result_url = "https://openapi.faceid.com/lite/v1/get_result";

function handleChineseID(req, res) {}
/* 
 * 1. get signature first
 * 2. get biz token
 * 3. get final url and redirect
*/
function handleChineseFaceID(req, res) {
  console.log("sending get request to " + signature_url);
  console.log("idcard_name and idcard_number : ");
  console.log(req);
  const idcard_name = "许晓明";
  const idcard_number = "220702198501074613";
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
        image_ref1: {}
      };
      console.log("sending post request to " + biz_token_url);
      axios({
        method: "post",
        url: biz_token_url,
        data: objSign
      }).then(
        function(result) {
          console.log("biz_token for face id : " + result.data.biz_token);
          const biz_token = result.data.biz_token;
          res.redirect(redirect_url + biz_token);
        },
        function(msg) {
          console.log(
            "Got error when post request to https://openapi.faceid.com/lite/v1/get_biz_token : " +
              msg
          );
        }
      );
    },
    function(msg) {
      console.log(
        "Got error when get request from http://120.79.193.99:5000/user_account/v1/user/user_face_sign : " +
          msg
      );
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
            res.sendFile(__dirname + "/index.html");
          } else {
            res.sendFile(__dirname + "/index_success.html");
          }
        },
        function(msg) {
          console.log(`Got error when get ${get_result_url} : ` + msg);
        }
      );
    },
    function(msg) {
      console.log(
        "Got error when get http://120.79.193.99:5000/user_account/v1/user/user_face_sign : " +
          msg
      );
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

// chinese id verification
app.get("/faceid_ocr", handleChineseID);

// chinese face id
app.get("/faceid_chinese", handleChineseFaceID);

// foreigner face image compare
app.get("/faceid_foreigner", handleForeignerFaceID);

// the url for return_url of faceid
app.get("/return", handleReturn);

// the url for notify_url of faceid
app.post("/notify", handleNotify);

// please change the port accordingly
const port = process.env.PORT || 10002;

app.listen(port, () => console.log("face id server hosts on " + port));
