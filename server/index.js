const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Portfolio = require('./models/Portfolio');
const DailyStockPrice = require('./models/DailyStockPrice');
const UserProfile = require('./models/UserProfile'); // Import the new model

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
  



// Route to fetch the latest stock prices
app.get('/api/stock/latest/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  const apiKey = process.env.TIINGO_API_KEY;
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Set to start of today

  try {
      // Check if we have today's data cached in the database
      let dailyPrice = await DailyStockPrice.findOne({ ticker, date: today });

      if (dailyPrice) {
          // If data exists for today, return it from the cache
          return res.json({
              open: dailyPrice.open,
              close: dailyPrice.close
          });
      }

      // If no data exists for today, make an API call to Tiingo
      const response = await axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}/prices`, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${apiKey}`
          }
      });

      if (response.data && response.data.length > 0) {
          const latestData = response.data[0];  // Take the most recent price data
          const { open, close } = latestData;

          // Save the data to the cache
          dailyPrice = new DailyStockPrice({
              ticker,
              open,
              close,
              date: today
          });
          await dailyPrice.save();

          // Return the fetched data
          return res.json({ open, close });
      } else {
          return res.status(404).json({ error: 'No data found for this ticker' });
      }
  } catch (error) {
      console.error(`Error fetching latest price for ${ticker}:`, error);
      res.status(500).json({ error: 'Error fetching latest price' });
  }
});




//User Profile routes
// Create a new user profile
// app.post('/api/user-profile/create', async (req, res) => {
//   const { userId, email } = req.body;

//   try {
//     // Check if a profile already exists for the user
//     const existingProfile = await UserProfile.findOne({ userId });
//     if (existingProfile) {
//       return res.status(200).json({ message: 'User profile already exists', userProfile: existingProfile });
//     }

//     // Create a new user profile if it doesn't exist
//     const newUserProfile = new UserProfile({
//       userId,
//       email,
//       firstName: '',
//       lastName: '',
//       phone: '',
//       address: ''
//     });

//     await newUserProfile.save();
//     return res.status(201).json({ message: 'User profile created successfully', userProfile: newUserProfile });
//   } catch (error) {
//     console.error('Error creating user profile:', error);
//     return res.status(500).json({ error: 'Error creating user profile' });
//   }
// });


app.post('/api/user-profile/create', async (req, res) => {
  const { userId, email } = req.body;

  try {
    // Check if a profile already exists for the user
    const existingProfile = await UserProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(200).json({ message: 'User profile already exists', userProfile: existingProfile });
    }

    // Create a new user profile if it doesn't exist
    const newUserProfile = new UserProfile({
      userId,
      email,
      firstName: '',
      lastName: '',
      phone: '',
      address: ''
    });

    // Save the new user profile
    await newUserProfile.save();

    // Also create an empty portfolio for the user
    const newPortfolio = new Portfolio({ userId, stocks: [] });
    await newPortfolio.save();

    return res.status(201).json({ message: 'User profile and empty portfolio created successfully', userProfile: newUserProfile });
  } catch (error) {
    console.error('Error creating user profile or portfolio:', error);
    return res.status(500).json({ error: 'Error creating user profile or portfolio' });
  }
});






// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});