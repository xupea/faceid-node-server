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

function handleRedirect(req, res) {
  axios({
    method: "get",
    url: "http://120.79.193.99:5000/user_account/v1/user/user_face_sign",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(function(result) {
      const signature = result.data.data.signature;
      const objSign = {
        sign: signature,
        sign_version: "hmac_sha1",
        return_url: "https://faceid-node-server.herokuapp.com/return",
        notify_url: "https://faceid-node-server.herokuapp.com/notify",
        capture_image: 0
      };
      axios({
        method: "post",
        url: "https://openapi.faceid.com/lite_ocr/v1/get_biz_token",
        data: objSign
      })
        .then(function(result) {
          console.log("biz_token for face id : " + result.data.biz_token);
          const biz_token = result.data.biz_token;
          res.redirect(
            "https://openapi.faceid.com/lite_ocr/v1/do/" + biz_token
          );
        })
        .error(function(msg) {
          console.log(
            "Got error when post https://openapi.faceid.com/lite_ocr/v1/get_biz_token : " +
              msg
          );
        });
    })
    .error(function(msg) {
      console.log(
        "Got error when get http://120.79.193.99:5000/user_account/v1/user/user_face_sign : " +
          msg
      );
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

app.get("/", handleRedirect);

app.get("/return", function(req, res) {
  const biz_token = req.query.biz_token;

  axios({
    method: "get",
    url: "http://120.79.193.99:5000/user_account/v1/user/user_face_sign",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function(result) {
    const sign = result.data.data.signature;
    const sign_version = "hmac_sha1";
    const need_image = 1;

    // check the result info
    axios({
      method: "get",
      url: `https://openapi.faceid.com/lite_ocr/v1/get_result?sign=${sign}&sign_version=${sign_version}&biz_token=${biz_token}&need_image=${need_image}`
    }).then(function(result) {
      console.log(result);
      res.sendFile(__dirname + "/index.html");
    });
  });
});

function handlePost(req, res) {
  console.log("post body : " + req.body);
  console.log(
    "biz_token from post for notify url : " + req.body.data.biz_token
  );
  console.log("error from post for notify url : " + req.body.data.error);
  res.end("yes");
}

app.post("/notify", handlePost);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("host on " + port));
