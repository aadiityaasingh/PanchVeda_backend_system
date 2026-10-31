const mongoose = require("mongoose");
const seedMainTherapies = require("../utils/seedTherapies.js");

function connectDB() {
  mongoose
    .connect(process.env.DB_URI)
    .then(async () => {
      console.log("db connected");
      await seedMainTherapies();
    })
    .catch((err) => {
      console.log("there is mongo error", err);
    });
}

module.exports = connectDB;
