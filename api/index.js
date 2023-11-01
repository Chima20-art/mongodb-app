const app = require("express")();
const express = require("express");
require("dotenv").config();

const { v4 } = require("uuid");
const mongoose = require("mongoose");
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  //credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

const dbURI = process.env.REACT_APP_dbURI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const UserConsent = require("../models/UserConsent");

app.get("/api", (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get("/api/getAll", async (req, res) => {
  try {
    const data = await UserConsent.find();
    res.setHeader("Access-Control-Allow-Origin", "*");
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
      }
    } else {
      res
        .status(400)
        .json({ status: false, message: "email and password are required" });
    }

    return res.status(200).json(dataToSave);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

app.listen(3003, function () {
  console.log("Server is listening on port 3003...");
});

module.exports = app;
