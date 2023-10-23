const express = require("express");
const app = express();

const mongoose = require("mongoose");
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
const dbURI =
  "mongodb+srv://michichchaimae:UF6y2g9SyFQmSqAr@cluster0.eghaojt.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const routes = require("./routes/routes");
const UserConsent = require("./models/UserConsent");
app.use("/", routes);
app.use(express.json());

// Replace with your MongoDB connection string

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => {
  res.send("Welcome to my MongoDB app!");
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

app.get("/getAll", async (req, res) => {
  try {
    const data = await UserConsent.find();
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.listen(3003, () => {
  console.log(`Server is running on port 3003`);
});
