const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const MmruSchema = new Schema({
  ville: String,
  image: String,
  adresse: String,
  nom: String,
  description: String,
  avis: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

MmruSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.avis,
      },
    });
  }
});

module.exports = mongoose.model("Mmru", MmruSchema);
