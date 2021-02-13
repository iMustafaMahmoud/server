const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Order = require("../models/Order");

// METHOD: POST
// REQUEST: Order object
const placeOrder = async (req, res) => {
  try {
    let newOrder = new Order(req.body);
    console.log(newOrder);
    await newOrder.save();
    res.status(200).send(newOrder);
  } catch (error) {
    console.log(error);
    return new HttpError("Invalid input passed, please check your data.", 422);
  }
};

// METHOD: GET
// RESPONSE: All orders
const getOrders = async (req, res) => {
  let orders;
  try {
    orders = await Order.find();
    res.send(orders);
  } catch (error) {
    return new HttpError("Fetching orders failed, please try again later.", 500);
  }
};

// METHOD: GET
// REQUEST: Order ID
// RESPONSE: Selected order by ID
const getOrderDetails = async (req, res) => {
  let orderId;
  let order;
  try {
    orderId = req.params.id;
    console.log(req.params);
    order = await Order.findById(orderId);
    res.send(order);
  } catch (error) {
    return new HttpError("Fetching order failed, please try again later.", 500);
  }
};

// METHOD: PATCH
// REQUEST: Order adjustemnts
// RESPONSE: New order's object
const editOrder = async (req, res) => {
  let orderId;
  let order;
  let newOrder;
  try {
    orderId = req.params.id;
    order = await Order.findById(orderId);
    newOrder = req.body;
    // TODO: Edit order and save it

    res.send(newOrder);
  } catch (error) {
    return new HttpError("Fetching order failed, please try again later.", 500);
  }
};

// METHOD: DELETE
// REQUEST: Order ID
const deleteOrder = async (req, res) => {
  let orderId;
  let order;
  try {
    orderId = req.params.id;
    order = await Order.findByIdAndDelete(orderId);
    res.send();
  } catch (error) {
    return new HttpError("Error deleting order", 500);
  }
};

exports.placeOrder = placeOrder;
exports.getOrders = getOrders;
exports.getOrderDetails = getOrderDetails;
exports.editOrder = editOrder;
exports.deleteOrder = deleteOrder;
