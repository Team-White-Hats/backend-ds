const express = require("express");
const {
  
    createDelivery,

} = require("../controllers/DeliveryController");



const router = express.Router();

router.post("/delivery",createDelivery);


module.exports = router;