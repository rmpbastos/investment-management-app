const mongoose = require('mongoose');

const TotalWealthSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  totalWealth: { type: Number, required: true },
  calculationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TotalWealth', TotalWealthSchema);
