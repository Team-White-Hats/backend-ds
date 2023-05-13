const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({

  address: {
    type: String,
    required: true,
  },

  deliveryType: {
    type: String,
    required: true,
  },

 deliverydate: {
    type: String,
    required: true,
  },
});

const delivery = mongoose.model("delivery", deliverySchema);

module.exports =delivery;