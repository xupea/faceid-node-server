const express = require("express");
const app = express();

const axios = require("axios");

function handleRedirect(req, res) {
  axios({
    method: "get",
    url: "http://120.79.193.99:5000/user_account/v1/user/user_face_sign",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function(result) {
    const signature = result.data.data.signature;
    const objSign = {
      sign: signature,
      sign_version: "hmac_sha1",
      return_url: "https://www.baidu.com",
      notify_url: "https://www.baidu.com",
      capture_image: 0
    };
    axios({
      method: "post",
      url: "https://openapi.faceid.com/lite_ocr/v1/get_biz_token",
      data: objSign
    }).then(function(result) {
      console.log("biz_token for face id : " + result.data.biz_token);
      const biz_token = result.data.biz_token;
      res.redirect("https://openapi.faceid.com/lite_ocr/v1/do/" + biz_token);
    });
  });
  //   const objSign2 = {
  //     sign:
  //       "G1r9GFAxqpQQ2EUhRT8p3lO/fFhhPXJuRWdlZlBoTmNLTkYxbGtwT1llREJGQ25uNXQ4d2tIJmI9MTUzODY1MTEyNyZjPTE1MzgyOTExMjcmZD0xNjQ2MjcwMzg=",
  //     sign_version: "hmac_sha1",
  //     return_url: "https://www.baidu.com",
  //     notify_url: "https://www.baidu.com",
  //     comparison_type: 1,
  //     idcard_name: "许晓明",
  //     idcard_number: "220702198501074613",
  //     liveness_type: "video_number"
  //   };

  //   axios({
  //     method: "post",
  //     url: "https://openapi.faceid.com/lite_ocr/v1/get_biz_token",
  //     data: objSign
  //   }).then(function(result) {
  //     console.log(result.data);
  //     const biz_token = result.data.biz_token;
  //     console.log("https://openapi.faceid.com/lite_ocr/v1/do/" + biz_token);
  //     res.redirect("https://openapi.faceid.com/lite_ocr/v1/do/" + biz_token);
  //   });
}

app.get("*", handleRedirect);

const port = 3230;

app.listen(port);
