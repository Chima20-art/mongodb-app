const app = require("express")();
const express = require("express");

const { v4 } = require("uuid");
const mongoose = require("mongoose");

app.get("/api", (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

const dbURI =
  "mongodb+srv://michichchaimae:UF6y2g9SyFQmSqAr@cluster0.eghaojt.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const UserConsent = require("../models/UserConsent");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to my MongoDB app!");
});

app.get("/getAll", async (req, res) => {
  try {
    const data = await UserConsent.find();
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/", async (req, res) => {
  console.log("body ", req);

  try {
    const data = new UserConsent({
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

module.exports = app;
