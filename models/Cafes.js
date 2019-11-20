const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cafesSchema = new Schema({
  name: String,
  address: String,
  description: String,
  coordinates: [Number],

  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Cafes = mongoose.model("Cafes", cafesSchema);

module.exports = Cafes;
