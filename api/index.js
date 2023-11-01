const app = require("express")();
const express = require("express");
require("dotenv").config();

const { v4 } = require("uuid");
const mongoose = require("mongoose");
// const cors = require("cors");

// const corsOptions = {
//   origin: ["localhost:3000"],

//   //credentials: true, //access-control-allow-credentials:true
//   //optionSuccessStatus: 200,
// };

app.use(express.json());

const dbURI = process.env.REACT_APP_dbURI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const UserConsent = require("../models/UserConsent");

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", req.hostname);
//   //    res.setHeader("Access-Control-Allow-Credentials", "true");
// api /
//   next();
// });

app.get("/api", (req, res) => {
  const path = `/api/item/${v4()}`;

  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.options("/api/getAll", async (req, res) => {
  return res.status(200).end();
});
app.options("/api/login", async (req, res) => {
  return res.status(200).end();
});

app.get("/api/getAll", async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    const data = await UserConsent.find();

    return res.json(data);
  } catch (error) {
    return res.end({ message: error.message });
  }
});

app.post("/api/addLog", async (req, res) => {
  console.log("body ", req);

  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    const data = new UserConsent({
      date: Date.now(),
      ip: ip,
      consentId: req?.body?.consentId,
      acceptType: req.body.acceptType,
      acceptedCategories: req.body.acceptedCategories,
      rejectedCategories: req.body.rejectedCategories,
    });
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  console.log("body ", req);
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  let users = [
    {
      email: "a@b.com",
      password: "12345678",
    },
  ];

  try {
    let email = req?.body?.email;
    let password = req?.body?.email;
    if (email && password) {
      let users = users.filter(
        (item) => item.email == email && item.password == password
      );
      if (users?.length > 0) {
        return res.status(200).json({
          status: true,
        });
      } else {
        return res
          .status(401)
          .json({ status: false, message: "User not found" });
      }
    } else {
      return res
        .status(400)
        .json({ status: false, message: "email and password are required" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

//app.use(cors({ origin: ["localhost:3000"] }));

app.listen(3003, function () {
  console.log("Server is listening on port 3003...");
});

module.exports = app;
