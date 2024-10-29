const mongoose = require('mongoose');

const DailyStockPriceSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  open: { type: Number, required: true },
  close: { type: Number, required: true },
  date: { type: Date, required: true }  // Date of the data
});

module.exports = mongoose.model('DailyStockPrice', DailyStockPriceSchema);
