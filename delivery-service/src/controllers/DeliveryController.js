const Delivery = require("../model/DeliveryModel");

const createDelivery = (req, res) => {
    Delivery.create(req.body, (err, data) => {
      if (err) res.status(500).json({ error: err });
      res.status(201).json(data);
    });
  };

  
module.exports = {
    createDelivery,
  };