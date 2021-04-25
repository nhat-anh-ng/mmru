const mongoose = require("mongoose");
const cities = require("./cities");
const names = require("./seedHelpers");
const adresses = require("./adresses");
const Mmru = require("../models/mmru");

mongoose.connect("mongodb://localhost:27017/mmru", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Mmru.deleteMany({});
  for (let i = 0; i < 7; i++) {
    const random7 = Math.floor(Math.random() * 7);

    const mm = new Mmru({
      ville: `${cities[random7].city}`,
      nom: `${sample(names.name)}`,
      adresse: `${sample(adresses.adress)}`,
      image: "http://www.hamonic-masson.com/IMG/jpg/001_takuji_shimmura.jpg",
      description: "lorem ipsum",
    });
    await mm.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
