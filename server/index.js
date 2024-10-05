const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


// Route to fetch stock meta data from Tiingo API
// https://www.tiingo.com/documentation/end-of-day
// app.get('/api/stock/:ticker', async (req, res) => {
//     const ticker = req.params.ticker;
//     const apiKey = process.env.TIINGO_API_KEY;

//     try {
//         const response = await axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Token ${apiKey}`
//             }
//         });
//         res.json(response.data)
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching stock data' });
//     }
// });

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