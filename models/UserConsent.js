// models/UserConsent.js
const mongoose = require("mongoose");

const userConsentSchema = new mongoose.Schema({
  date: Number,
  consentId: String,
  acceptType: String,
  acceptedCategories: [String],
  rejectedCategories: [String],
});

const UserConsent = mongoose.model("UserConsent", userConsentSchema);

module.exports = UserConsent;
