const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
const port = process.env.PORT || 11000;

require("dotenv").config();

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.set("views", __dirname + "/views/");
app.set("view engine", "jade");

app.use(require("./controllers"));

app.listen(port, () => console.log("face id server hosts on port " + port));
