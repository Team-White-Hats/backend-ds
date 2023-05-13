const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({

  productName: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },
  quantity : {
    type: Number,
    required: true,
  },

  image: {
    type: String,
    
  },
  status:{
	type: String,
    required: true,
  },
  smallDescription: {
    type: String,
    required: true,
  },

  longDescription: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("StoreProduct", ProductSchema);

module.exports = Product;