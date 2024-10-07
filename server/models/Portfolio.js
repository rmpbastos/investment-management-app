const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    stocks: [
        {
            ticker: String,
            name: String,
            assetType: String,
            addedAt: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);