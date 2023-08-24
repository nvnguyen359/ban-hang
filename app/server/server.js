require("dotenv").config();
const path = require('path');
const cors = require("cors");
const apis = require("./apis/apiCrud");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const allowedOrigins = ["http://localhost:3177", "http://localhost:3177/#/"];
//require('./apis/apiExcute')
const port = process.env.PORT;
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cors({ origin: "*" }));

app.use(function (req, res, next) {
  // Website you wish to allow to connect

  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // Pass to next layer of middleware
  next();
});

//============================================================

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
// Function to serve all static files
// inside public directory.
app.use(express.static("public"));

app.use("/uploads", express.static("uploads"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/imgs", express.static(path.join(__dirname, "imgs")));
app.get("/", (req, res) => {
  res.send("Api ready!");
});
apis.callApis(app);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
