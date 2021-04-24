const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MmruSchema = new Schema({
  ville: String,
  adresse: String,
  nom: String,
  description: String,
});

module.exports = mongoose.model("Mmru", MmruSchema);
