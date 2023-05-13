const mongoose = require("mongoose");

const StorePaymentSchema = new mongoose.Schema(
  {
  
    amount: {
      type: String,
      required: true,
    },
    oderid:{
      type: String,
      required: true,
    },
    phoneNumber:{
      type:Number,
      required:true,
    },
  },
  {
    timestamps: true,
  }
);

const StorePayment = mongoose.model("StorePayment", StorePaymentSchema);

module.exports = StorePayment;