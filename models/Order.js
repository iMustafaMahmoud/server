const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    customerId: { type: String, required: true, ref: "User" },
    items: [
      {
        product_id: { type: mongoose.Types.ObjectId },
        unit_price: { type: Number },
        quantity: { type: Number },
      },
    ],
    status: { type: String, required: true, trim: true },
    placement_date: { type: String, required: true },
    delivery_date: { type: String },
    promo_code: { applied: Boolean, amount: Number }, // Amount will be %
    total_amount: { type: Number, required: true },
    comments: { type: String, trim: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Order", orderSchema);
