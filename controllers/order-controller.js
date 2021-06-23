const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Order = require("../models/Order");
const User = require("../models/User");

const placeOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { items, promo_code, total_amount, comments, uid } = req.body;

  var id = mongoose.Types.ObjectId(uid);

  const createdOrder = new Order({
    customerId: id,
    items,
    status: "Placed",
    placement_date: Date.now(),
    delivery_date: "none",
    promo_code,
    total_amount,
    comments,
  });

  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    console.log("user problem");
    const error = new HttpError("Creating order failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "We could not find user for the provided id",
      404
    );
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdOrder.save({ session: sess }); //make the unique id here
    user.orders.push(createdOrder);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating order failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).send(createdOrder);
};

const getOrderById = async (req, res) => {
  const orderId = req.params.oid;

  let order;
  try {
    order = await Order.findById(orderId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find this order.",
      500
    );
    return next(error);
  }

  if (!order) {
    const error = new HttpError(
      "Could not find an order for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ order: order.toObject({ getters: true }) });
};

const getOrderByUserEmail = async (req, res) => {
  const email = req.params.email;

  let userWithOrders;
  try {
    userWithOrders = await User.findOne({ email }).populate("orders");
  } catch (err) {
    const error = new HttpError(
      "Fetching orders failed, please try again later",
      500
    );
    return next(error);
  }

  if (!userWithOrders || userWithOrders.orders.length === 0) {
    return next(
      new HttpError("Could not find an order for the provided user id.", 404)
    );
  }

  res.send({
    orders: userWithOrders.orders.map((order) =>
      order.toObject({ getters: true })
    ),
  });
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.oid;

  let order;
  try {
    order = await Order.findById(orderId).populate("customerId");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete order.",
      500
    );
    return next(error);
  }

  if (!order) {
    const error = new HttpError("Could not find order for this id. ", 404);
    return next(error);
  }

  if (order.customerId.id.toString() !== req.userData.userId) {
    const error = new HttpError("You are allowed to delete this order.", 401);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await order.remove({ session: sess });
    order.customerId.orders.pull(order);
    await order.customerId.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete order.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Order Canceled." });
};

exports.placeOrder = placeOrder;
exports.getOrderById = getOrderById;
exports.getOrderByUserEmail = getOrderByUserEmail;
exports.deleteOrder = deleteOrder;
