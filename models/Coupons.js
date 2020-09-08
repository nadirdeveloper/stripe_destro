const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CouponsSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  amount_off: {
    type: Schema.Types.Mixed,
  },  
  created:{
    type: Number,
    required: true
  },
  currency:{
    type: String,
    required: true
  },
  duration:{
    type: String,
    required: true
  },
  duration_in_months:{
    type: Number,
    required: true
  },
  livemode:{
    type: Boolean,
    required: true
  },
  max_redemptions:{
    type: Schema.Types.Mixed,
  },
  metadata:{
    type: {},
    required: true
  },
  name:{
    type: String,
    required: true
  },
  percent_off:{
    type: Number,
    required:true
  },
  redeem_by:{
    type: Schema.Types.Mixed,
  },
  times_redeemed:{
    type: Number,
    required: true
  },
  valid:{
    type: Boolean,
    required: true
  }
});

module.exports = Coupons = mongoose.model("coupons", CouponsSchema);
