const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));


// Route to search for stocks using Tiingo Search API
// https://www.tiingo.com/documentation/utilities/search
app.get('/api/search/:query', async (req, res) => {
    const query = req.params.query;
    const apiKey = process.env.TIINGO_API_KEY;

    try {
        const response = await axios.get(`https://api.tiingo.com/tiingo/utilities/search?query=${query}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${apiKey}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error searching for stock data' });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});