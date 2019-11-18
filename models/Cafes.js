const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cloudinary = require("cloudinary").v2;

const cafesSchema = new Schema({
  name: String,
  address: String,
  description: String,
  coordinates: [Number]
  // owner: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User"
  // },
  // comments: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Comment"
  //   }
  // ],
});

const Cafes = mongoose.model("Cafes", cafesSchema);

module.exports = Cafes;
