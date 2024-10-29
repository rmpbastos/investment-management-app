const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Portfolio = require('./models/Portfolio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
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


// Route to add a stock to a user's portfolio
app.post('/api/portfolio/add', async (req, res) => {
    console.log(req.body);
    const { userId, stock } = req.body;
  
    try {
        let portfolio = await Portfolio.findOne({ userId });

        if (!portfolio) {
            portfolio = new Portfolio({ userId, stocks: [stock] });
        } else {
            portfolio.stocks.push(stock);
        }

        await portfolio.save();
        res.json({ message: 'Stock added to portfolio' });
    } catch (error) {
        console.error('Error adding stock to portfolio:', error);
        res.status(500).json({ error: 'Error adding stock to portfolio' });
    }
});


app.get('/api/portfolio/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const portfolio = await Portfolio.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }
        res.json(portfolio.stocks); // Return all stock data
    } catch (error) {
        res.status(500).json({ error: 'Error fetching portfolio data' });
    }
});



// Route to aggregate stock data by ticker
app.get('/api/portfolio/aggregate/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const portfolio = await Portfolio.findOne({ userId });
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }
  
      // Grouping stocks by ticker
      const aggregatedStocks = portfolio.stocks.reduce((acc, stock) => {
        const { ticker, name, assetType, quantity, purchasePrice, brokerageFees } = stock;
  
        if (!acc[ticker]) {
          acc[ticker] = {
            ticker,
            name,
            assetType,
            totalQuantity: 0,
            totalCost: 0,
          };
        }
  
        // Accumulate total quantity and cost
        acc[ticker].totalQuantity += quantity;
        acc[ticker].totalCost += (quantity * purchasePrice) + brokerageFees;
  
        return acc;
      }, {});
  
      // Calculate average purchase price as total cost divided by total quantity
      const result = Object.values(aggregatedStocks).map(stock => ({
        ticker: stock.ticker,
        name: stock.name,
        assetType: stock.assetType,
        totalQuantity: stock.totalQuantity,
        averagePurchasePrice: stock.totalCost / stock.totalQuantity, // New calculation
        totalCost: stock.totalCost,
      }));
  
      res.json(result);
    } catch (error) {
      console.error('Error aggregating stock data:', error);
      res.status(500).json({ error: 'Error aggregating stock data' });
    }
  });












// Route to add stock details
app.post('/api/portfolio/addDetails', async (req, res) => {
    const { userId, stock } = req.body;
  
    try {
      let portfolio = await Portfolio.findOne({ userId });
  
      if (!portfolio) {
        portfolio = new Portfolio({ userId, stocks: [stock] });
      } else {
        portfolio.stocks.push(stock);
      }
  
      await portfolio.save();
      res.json({ message: 'Stock details added to portfolio' });
    } catch (error) {
      console.error('Error adding stock details to portfolio:', error);
      res.status(500).json({ error: 'Error adding stock details to portfolio' });
    }
  });
  


  





// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});