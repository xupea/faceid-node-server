const express = require("express");
const app = express();

const axios = require("axios");

function handleRedirect(req, res) {
  const objSign = {
    sign:
      "G1r9GFAxqpQQ2EUhRT8p3lO/fFhhPXJuRWdlZlBoTmNLTkYxbGtwT1llREJGQ25uNXQ4d2tIJmI9MTUzODY1MTEyNyZjPTE1MzgyOTExMjcmZD0xNjQ2MjcwMzg=",
    sign_version: "hmac_sha1",
    return_url: "https://www.baidu.com",
    notify_url: "https://www.baidu.com",
    capture_image: 0
  };
  const objSign2 = {
    sign:
      "G1r9GFAxqpQQ2EUhRT8p3lO/fFhhPXJuRWdlZlBoTmNLTkYxbGtwT1llREJGQ25uNXQ4d2tIJmI9MTUzODY1MTEyNyZjPTE1MzgyOTExMjcmZD0xNjQ2MjcwMzg=",
    sign_version: "hmac_sha1",
    return_url: "https://www.baidu.com",
    notify_url: "https://www.baidu.com",
    comparison_type: 1,
    idcard_name: "许晓明",
    idcard_number: "220702198501074613",
    liveness_type: "video_number"
  };

  axios({
    method: "post",
    url: "https://openapi.faceid.com/lite_ocr/v1/get_biz_token",
    data: objSign
  }).then(function(result) {
    console.log(result.data);
    const biz_token = result.data.biz_token;
    console.log("https://openapi.faceid.com/lite_ocr/v1/do/" + biz_token);
    res.redirect("https://openapi.faceid.com/lite_ocr/v1/do/" + biz_token);
  });
}

app.get("*", handleRedirect);

const port = 3230;

app.listen(port);
