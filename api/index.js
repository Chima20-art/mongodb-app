const app = require("express")();
const express = require("express");
require("dotenv").config();

const { v4 } = require("uuid");
const mongoose = require("mongoose");
const cors = require("cors");

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

// app.options("/api/getAll", async (req, res) => {
//   return res.status(200).end();
// });

// app.options("/api/addLog", async (req, res) => {
//   return res.status(200).end();
// });

app.all("/api/getAll", async (req, res) => {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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

    let page = req?.query?.page ? parseInt(req.query.page) : 1;
    let limit = req?.query?.limit ? parseInt(req.query.limit) : 50;
    let ip = req.query.ip; // IP value

    let NotANUmber = NaN;

    if (isNaN(page) || page < 1) {
      page = 1;
    }
    if (isNaN(limit) || limit < 1 || limit > 1001) {
      limit = 50;
    }

    const skipIndex = (page - 1) * limit;

    let query = {};
    if (ip) {
      query.ip = { $regex: ip, $options: "i" };
    }

    const data = await UserConsent.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .skip(skipIndex)
      .exec();

    const totalCount = await UserConsent.countDocuments(query);

    return res.status(200).json({
      data,
      totalCount,
    });
  } catch (error) {
    return res.status(501).end({ message: error.message });
  }
});

app.options("/api/addLog", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Handle preflight request. When receiving a preflight request (a request with an OPTIONS method), we need to set the content-length to 0, and return a status of 200.
  return res.status(200).end();
});

app.post("/api/addLog", async (req, res) => {
  console.log("body ", req);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

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

app.options("/api/login", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Handle preflight request. When receiving a preflight request (a request with an OPTIONS method), we need to set the content-length to 0, and return a status of 200.
  return res.status(200).end();
}); // Enable CORS pre-flight request for this route

app.post("/api/login", async (req, res) => {
  console.log("api/login called");
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);

    let users = [
      {
        email: "chaimae@michich.com",
        password: "VIa3+8d2mk3|",
      },
      {
        email: "sertacgulce@cagri.com",
        password: "36XIna9KT6+",
      },
    ];
    let email = req?.body?.email;
    let password = req?.body?.password;
    if (email && password) {
      let user = users.filter(
        (item) => item.email == email && item.password == password
      );
      if (user?.length > 0) {
        return res.status(200).json({
          status: true,
        });
      } else {
        return res
          .status(200)
          .json({ status: false, message: "User not found", email, password });
      }
    } else {
      return res.status(200).json({
        status: false,
        message: "email and password are required",
        email,
        password,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: error.message });
  }
});

//app.use(cors({ origin: ["localhost:3000"] }));

app.listen(3003, function () {
  console.log("Server is listening on port 3003...");
});

module.exports = app;

const allowCors = (fn) => async (req, res) => {
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
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};
