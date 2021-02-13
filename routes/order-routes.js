const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order-controller");

router.post("/", orderController.placeOrder);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderDetails);
router.patch("/:id", orderController.editOrder);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
