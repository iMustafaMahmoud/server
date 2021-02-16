const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order-controller");

router.post("/", orderController.placeOrder);
router.get("/:oid", orderController.getOrderById);
router.get("/:uid", orderController.getOrderByUserEmail);
//router.patch("/:id", orderController.editOrder);
router.delete("/:oid", orderController.deleteOrder);

module.exports = router;
