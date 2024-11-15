// const mongoose = require('mongoose');

// const TotalWealthSchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   totalWealth: { type: Number, required: true },
//   calculationDate: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('TotalWealth', TotalWealthSchema);



// models/TotalWealth.js
const mongoose = require('mongoose');

const TotalWealthSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  totalWealth: { type: Number, required: true },
  totalInvested: { type: Number, required: true, default: 0 }, // New field
  calculationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TotalWealth', TotalWealthSchema);
