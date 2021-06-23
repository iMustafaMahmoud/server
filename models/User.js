const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    date_of_birth: { type: String, required: true },
    gender: { type: String, required: true },
    orders: [{ type: mongoose.Types.ObjectId, required: true, ref: "Order" }],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.plugin(uniqueValidator); //to insure user is created before or not

module.exports = mongoose.model("User", userSchema);
