const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Portfolio = require('./models/Portfolio');
const DailyStockPrice = require('./models/DailyStockPrice');
const UserProfile = require('./models/UserProfile');
const TotalWealth = require('./models/TotalWealth');
const StockPurchaseHistory = require('./models/StockPurchaseHistory');
const StockSaleHistory = require('./models/StockSaleHistory');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // ******************** FLASK API TEST ********************

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

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
// ******** NOT BEING USED? **********
// app.post('/api/portfolio/add', async (req, res) => {
//   const { userId, stock } = req.body;

//   try {
//     // Find the user's portfolio
//     let portfolio = await Portfolio.findOne({ userId });

//     if (!portfolio) {
//       portfolio = new Portfolio({ userId, stocks: [stock] });
//     } else {
//       portfolio.stocks.push(stock);
//     }

//     await portfolio.save();

//     // Update total wealth after saving the portfolio
//     try {
//       const updateResponse = await axios.post('http://localhost:5000/api/total-wealth/update', { userId });
//       console.log('Total wealth updated:', updateResponse.data);
//     } catch (updateError) {
//       console.error('Error updating total wealth:', updateError.response?.data || updateError.message);
//     }

//     res.json({ message: 'Stock added to portfolio and total wealth updated' });
//   } catch (error) {
//     console.error('Error adding stock to portfolio:', error);
//     res.status(500).json({ error: 'Error adding stock to portfolio' });
//   }
// });




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
// app.post('/api/portfolio/addDetails', async (req, res) => {
//     const { userId, stock } = req.body;
  
//     try {
//       let portfolio = await Portfolio.findOne({ userId });
  
//       if (!portfolio) {
//         portfolio = new Portfolio({ userId, stocks: [stock] });
//       } else {
//         portfolio.stocks.push(stock);
//       }
  
//       await portfolio.save();
//       res.json({ message: 'Stock details added to portfolio' });
//     } catch (error) {
//       console.error('Error adding stock details to portfolio:', error);
//       res.status(500).json({ error: 'Error adding stock details to portfolio' });
//     }
//   });
app.post('/api/portfolio/addDetails', async (req, res) => {
  const { userId, stock } = req.body;

  try {
    // Convert input values to numbers
    const quantity = parseFloat(stock.quantity);
    const purchasePrice = parseFloat(stock.purchasePrice);
    const brokerageFees = parseFloat(stock.brokerageFees);

    // Calculate total cost as a number
    const totalCost = parseFloat(((quantity * purchasePrice) + brokerageFees).toFixed(2));

    // Validate the total cost
    if (isNaN(totalCost)) {
      throw new Error(`Invalid totalCost value: ${totalCost}`);
    }

    // Add to Portfolio
    let portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      portfolio = new Portfolio({ userId, stocks: [stock] });
    } else {
      portfolio.stocks.push(stock);
    }
    await portfolio.save();

    // Add to StockPurchaseHistory
    const purchaseRecord = new StockPurchaseHistory({
      userId,
      ticker: stock.ticker,
      name: stock.name,
      purchaseDate: stock.purchaseDate,
      quantity,
      purchasePrice,
      brokerageFees,
      totalCost,
    });
    await purchaseRecord.save();

    res.json({ message: 'Stock details added to portfolio and purchase history saved' });
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
              date: today  // new Date()????
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


// Route to calculate and save user total wealth
// app.post('/api/total-wealth/update', async (req, res) => {
//   const { userId } = req.body;
//   const apiKey = process.env.TIINGO_API_KEY;

//   try {
//     // Fetch the user's portfolio
//     const portfolio = await Portfolio.findOne({ userId });
//     if (!portfolio || portfolio.stocks.length === 0) {
//       console.log(`Portfolio is empty for userId: ${userId}. Returning default wealth values.`);
//       return res.status(200).json({ totalWealth: 0, totalInvested: 0 });
//     }

//     let totalWealth = 0;
//     let totalInvested = 0;

//     // Iterate through the stocks in the portfolio
//     for (const stock of portfolio.stocks) {
//       const { ticker, quantity, purchasePrice, brokerageFees } = stock;

//       // Fetch the latest close price from the backend (same as used in StockCard)
//       try {
//         const response = await axios.post(`http://localhost:5000/api/stock/latest/${ticker}`, {
//           method: "POST",
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         const latestPrice = response.data;

//         // If we have valid price data, calculate the stock value and total cost
//         if (latestPrice && latestPrice.close) {
//           totalWealth += latestPrice.close * quantity;
//         }

//         // Calculate total invested (cost of the stock including brokerage fees)
//         totalInvested += (quantity * purchasePrice) + brokerageFees;
//       } catch (error) {
//         console.error(`Error fetching latest price for ${ticker}:`, error.message);
//         continue; // Skip the stock if there's an error
//       }
//     }

//     // Check if total wealth remains zero
//     if (totalWealth === 0) {
//       console.log(`Total wealth remains zero for userId: ${userId}.`);
//       return res.status(400).json({ error: 'Total wealth could not be calculated.' });
//     }

//     // Update or create the TotalWealth entry
//     const userWealth = await TotalWealth.findOneAndUpdate(
//       { userId },
//       { totalWealth, totalInvested, calculationDate: new Date() },
//       { upsert: true, new: true }
//     );

//     res.status(200).json({
//       totalWealth: userWealth.totalWealth,
//       totalInvested: userWealth.totalInvested,
//     });
//   } catch (error) {
//     console.error('Error updating total wealth:', error);
//     res.status(500).json({ error: 'Error updating total wealth' });
//   }
// });


// app.post('/api/total-wealth/update', async (req, res) => {
//   const { userId } = req.body;
//   const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

//   try {
//     const portfolio = await Portfolio.findOne({ userId });

//     if (!portfolio || portfolio.stocks.length === 0) {
//       return res.status(200).json({ totalWealth: 0, totalInvested: 0 });
//     }

//     let totalWealth = 0;
//     let totalInvested = 0;

//     for (const stock of portfolio.stocks) {
//       const { ticker, quantity, purchasePrice, brokerageFees } = stock;

//       // Fetch the latest stock price directly
//       const priceUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${apiKey}`;

//       try {
//         console.log(`Fetching price data for ${ticker}...`);
//         const response = await axios.get(priceUrl);

//         if (response.headers['content-type'].includes('application/json')) {
//           const data = response.data;
//           if (data["Time Series (Daily)"]) {
//             const latestDate = Object.keys(data["Time Series (Daily)"])[0];
//             const latestData = data["Time Series (Daily)"][latestDate];

//             const closePrice = parseFloat(latestData["4. close"]);
//             if (!isNaN(closePrice)) {
//               totalWealth += closePrice * quantity;
//             }
//           }
//         }
//       } catch (error) {
//         console.error(`Error fetching price data for ${ticker}:`, error.message);
//       }

//       totalInvested += (quantity * purchasePrice) + brokerageFees;
//     }

//     const userWealth = await TotalWealth.findOneAndUpdate(
//       { userId },
//       { totalWealth, totalInvested, calculationDate: new Date() },
//       { upsert: true, new: true }
//     );

//     res.status(200).json({ totalWealth: userWealth.totalWealth, totalInvested: userWealth.totalInvested });
//   } catch (error) {
//     console.error('Error updating total wealth:', error);
//     res.status(500).json({ error: 'Error updating total wealth' });
//   }
// });




app.post('/api/total-wealth/update', async (req, res) => {
  const { userId } = req.body;
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  try {
    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio || portfolio.stocks.length === 0) {
      return res.status(200).json({ totalWealth: 0, totalInvested: 0 });
    }

    let totalWealth = 0;
    let totalInvested = 0;

    for (const stock of portfolio.stocks) {
      const { ticker, quantity, purchasePrice, brokerageFees } = stock;

      // Attempt to fetch intraday data for real-time price
      const intradayUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${apiKey}`;

      let currentPrice = null;

      try {
        console.log(`Fetching intraday price data for ${ticker}...`);
        const intradayResponse = await axios.get(intradayUrl);

        if (intradayResponse.headers['content-type'].includes('application/json')) {
          const intradayData = intradayResponse.data;
          const timeSeries = intradayData["Time Series (5min)"];

          if (timeSeries) {
            const latestTimestamp = Object.keys(timeSeries)[0];
            const latestIntradayData = timeSeries[latestTimestamp];
            currentPrice = parseFloat(latestIntradayData["4. close"]);
          }
        }
      } catch (error) {
        console.error(`Error fetching intraday price for ${ticker}:`, error.message);
      }

      // If intraday data is not available, fallback to daily adjusted data
      if (!currentPrice) {
        const dailyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${apiKey}`;

        try {
          console.log(`Fetching daily adjusted price data for ${ticker}...`);
          const dailyResponse = await axios.get(dailyUrl);

          if (dailyResponse.headers['content-type'].includes('application/json')) {
            const dailyData = dailyResponse.data;
            if (dailyData["Time Series (Daily)"]) {
              const latestDate = Object.keys(dailyData["Time Series (Daily)"])[0];
              const latestDailyData = dailyData["Time Series (Daily)"][latestDate];
              currentPrice = parseFloat(latestDailyData["4. close"]);
            }
          }
        } catch (error) {
          console.error(`Error fetching daily adjusted price for ${ticker}:`, error.message);
        }
      }

      // If a valid current price was fetched, update total wealth
      if (!isNaN(currentPrice)) {
        totalWealth += currentPrice * quantity;
      }

      // Calculate total invested amount
      totalInvested += (quantity * purchasePrice) + brokerageFees;
    }

    // Update total wealth in the database
    const userWealth = await TotalWealth.findOneAndUpdate(
      { userId },
      { totalWealth, totalInvested, calculationDate: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ totalWealth: userWealth.totalWealth, totalInvested: userWealth.totalInvested });
  } catch (error) {
    console.error('Error updating total wealth:', error);
    res.status(500).json({ error: 'Error updating total wealth' });
  }
});










// Route to fetch the latest total wealth for a user
// app.get('/api/total-wealth/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const latestWealth = await TotalWealth.findOne({ userId }).sort({ calculationDate: -1 });

//     if (!latestWealth) {
//       console.log(`No wealth data found for userId: ${userId}`);  // Debug line
//       return res.status(404).json({ error: 'No wealth data found' });
//     }

//     res.status(200).json({ totalWealth: latestWealth.totalWealth });
//   } catch (error) {
//     console.error('Error fetching total wealth:', error);
//     res.status(500).json({ error: 'Error fetching total wealth' });
//   }
// });


// Route to fetch the latest total wealth for a user
// app.get('/api/total-wealth/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     let latestWealth = await TotalWealth.findOne({ userId }).sort({ calculationDate: -1 });

//     // If no wealth data is found, create a default entry
//     if (!latestWealth) {
//       console.log(`No wealth data found for userId: ${userId}. Creating a default entry.`);
//       latestWealth = new TotalWealth({
//         userId,
//         totalWealth: 0,
//         totalInvested: 0,
//         calculationDate: new Date(),
//       });
//       await latestWealth.save();
//     }

//     res.status(200).json({ totalWealth: latestWealth.totalWealth, totalInvested: latestWealth.totalInvested });
//   } catch (error) {
//     console.error('Error fetching total wealth:', error);
//     res.status(500).json({ error: 'Error fetching total wealth' });
//   }
// });



app.get('/api/total-wealth/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the latest total wealth data without creating a new entry
    const latestWealth = await TotalWealth.findOne({ userId }).sort({ calculationDate: -1 });

    if (!latestWealth) {
      console.log(`No wealth data found for userId: ${userId}.`);
      return res.status(404).json({ error: 'No wealth data found for this user.' });
    }

    res.status(200).json({
      totalWealth: latestWealth.totalWealth,
      totalInvested: latestWealth.totalInvested,
    });
  } catch (error) {
    console.error('Error fetching total wealth:', error);
    res.status(500).json({ error: 'Error fetching total wealth' });
  }
});



// Route to create initial TotalWealth entry for a new user
app.post('/api/total-wealth/create', async (req, res) => {
  const { userId } = req.body;

  try {
    // Check if a TotalWealth entry already exists for the user
    const existingWealth = await TotalWealth.findOne({ userId });
    if (existingWealth) {
      return res.status(200).json({ message: 'TotalWealth entry already exists' });
    }

    // Create a new TotalWealth entry with default values
    const newWealth = new TotalWealth({
      userId,
      totalWealth: 0,
      totalInvested: 0,
      calculationDate: new Date()
    });

    await newWealth.save();
    res.status(201).json({ message: 'Initial TotalWealth entry created successfully' });
  } catch (error) {
    console.error('Error creating initial TotalWealth entry:', error);
    res.status(500).json({ error: 'Error creating initial TotalWealth entry' });
  }
});




// Route to handle stock sale
app.post("/api/portfolio/sell", async (req, res) => {
  const { userId, ticker, sellDate, quantitySold, sellPrice, brokerageFees } = req.body;

  try {
    // Fetch the user's portfolio
    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    // Find the stock in the portfolio
    const stockIndex = portfolio.stocks.findIndex((s) => s.ticker === ticker);
    if (stockIndex === -1) {
      return res.status(404).json({ error: "Stock not found in portfolio" });
    }

    const stock = portfolio.stocks[stockIndex];

    // Validate that the user is not selling more shares than they own
    if (quantitySold > stock.quantity) {
      return res.status(400).json({ error: "Cannot sell more shares than owned" });
    }

    // Initialize variables for FIFO calculation
    let remainingQuantity = quantitySold;
    let totalCostOfSoldShares = 0;

    // Process sale using FIFO on purchaseLots
    while (remainingQuantity > 0 && stock.purchaseLots.length > 0) {
      const lot = stock.purchaseLots[0];

      if (lot.quantity <= remainingQuantity) {
        // Sell entire lot
        totalCostOfSoldShares += lot.quantity * lot.purchasePrice;
        remainingQuantity -= lot.quantity;
        stock.purchaseLots.shift(); // Remove the sold lot
      } else {
        // Partially sell the lot
        totalCostOfSoldShares += remainingQuantity * lot.purchasePrice;
        lot.quantity -= remainingQuantity;
        remainingQuantity = 0;
      }
    }

    // Calculate the total sale value
    const totalSaleValue = (quantitySold * sellPrice) - brokerageFees;

    // Update the stock's quantity and total cost
    stock.quantity -= quantitySold;
    stock.totalCost -= totalCostOfSoldShares;

    // If the stock's quantity is zero, remove it from the portfolio
    if (stock.quantity === 0) {
      portfolio.stocks.splice(stockIndex, 1);
    }

    // Save the updated portfolio
    await portfolio.save();

    // Record the sale in StockSaleHistory
    const saleRecord = new StockSaleHistory({
      userId,
      ticker,
      sellDate,
      quantitySold,
      sellPrice,
      brokerageFees,
      totalSaleValue,
    });
    await saleRecord.save();

    // Update TotalWealth after the sale
    try {
      const updateResponse = await axios.post("http://localhost:5000/api/total-wealth/update", { userId });
      console.log("Total wealth updated:", updateResponse.data);
    } catch (updateError) {
      console.error("Error updating total wealth:", updateError.message);
    }

    res.json({ message: "Stock sale recorded and portfolio updated successfully" });
  } catch (error) {
    console.error("Error handling stock sale:", error);
    res.status(500).json({ error: "Error handling stock sale" });
  }
});





// Route to Fetch Sentiment Data
app.post('/api/stock/sentiment/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!ticker) {
    return res.status(400).json({ error: 'Ticker symbol is required.' });
  }

  const sentimentUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${apiKey}`;

  try {
    console.log(`Fetching sentiment data for ${ticker}...`);
    const response = await axios.get(sentimentUrl);

    if (response.headers['content-type'].includes('application/json')) {
      const data = response.data;
      if (data.feed && data.feed.length > 0) {
        const latestArticle = data.feed[0];
        const overallSentimentScore = parseFloat(latestArticle.overall_sentiment_score) || 0;
        const tickerSentimentScore = parseFloat(latestArticle.ticker_sentiment?.[0]?.ticker_sentiment_score) || 0;

        return res.json({ overallSentimentScore, tickerSentimentScore });
      } else {
        return res.status(404).json({ error: 'No sentiment data found for this ticker.' });
      }
    } else {
      return res.status(500).json({ error: 'Invalid response from API.' });
    }
  } catch (error) {
    console.error(`Error fetching sentiment data for ${ticker}:`, error);
    res.status(500).json({ error: 'Error fetching sentiment data.' });
  }
});

// Route to Fetch Price Data for the ML model
app.post('/api/stock/latest/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!ticker) {
    return res.status(400).json({ error: 'Ticker symbol is required.' });
  }

  const priceUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${apiKey}`;

  try {
    console.log(`Fetching price data for ${ticker}...`);
    const response = await axios.get(priceUrl);

    if (response.headers['content-type'].includes('application/json')) {
      const data = response.data;
      if (data["Time Series (Daily)"]) {
        const latestDate = Object.keys(data["Time Series (Daily)"])[0];
        const latestData = data["Time Series (Daily)"][latestDate];

        const priceData = {
          open: parseFloat(latestData["1. open"]),
          high: parseFloat(latestData["2. high"]),
          low: parseFloat(latestData["3. low"]),
          close: parseFloat(latestData["4. close"]),
          adjusted_close: parseFloat(latestData["5. adjusted close"]),
          volume: parseInt(latestData["6. volume"]),
          dividend_amount: parseFloat(latestData["7. dividend amount"]),
          split_coefficient: parseFloat(latestData["8. split coefficient"]),
        };

        return res.json(priceData);
      } else {
        return res.status(404).json({ error: 'No price data found for this ticker.' });
      }
    } else {
      return res.status(500).json({ error: 'Invalid response from API.' });
    }
  } catch (error) {
    console.error(`Error fetching price data for ${ticker}:`, error);
    res.status(500).json({ error: 'Error fetching price data.' });
  }
});




// Route to Fetch Intraday Price Data (most up-to-date)
app.post('/api/stock/intraday/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  const intradayUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${apiKey}&outputsize=compact`;

  try {
    console.log(`Fetching intraday price data for ${ticker}...`);
    const response = await axios.get(intradayUrl);

    if (response.headers['content-type'].includes('application/json')) {
      const data = response.data;
      const timeSeries = data["Time Series (5min)"];
      if (timeSeries) {
        const latestTimestamp = Object.keys(timeSeries)[0];
        const latestData = timeSeries[latestTimestamp];

        const intradayPriceData = {
          open: parseFloat(latestData["1. open"]),
          high: parseFloat(latestData["2. high"]),
          low: parseFloat(latestData["3. low"]),
          close: parseFloat(latestData["4. close"]),
          volume: parseInt(latestData["5. volume"]),
        };

        return res.json(intradayPriceData);
      } else {
        return res.status(404).json({ error: 'No intraday data found for this ticker.' });
      }
    } else {
      return res.status(500).json({ error: 'Invalid response from API.' });
    }
  } catch (error) {
    console.error(`Error fetching intraday data for ${ticker}:`, error);
    res.status(500).json({ error: 'Error fetching intraday price data.' });
  }
});





// Route to get total wealth data for the past 12 months (for the area chart)
// app.get('/api/total-wealth/history/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Get the current date and subtract 12 months
//     const currentDate = new Date();
//     const oneYearAgo = new Date(currentDate);
//     oneYearAgo.setMonth(currentDate.getMonth() - 12);

//     // Fetch total wealth data for the past 12 months
//     const wealthHistory = await TotalWealth.find({
//       userId,
//       calculationDate: { $gte: oneYearAgo },
//     }).sort({ calculationDate: 1 });

//     res.status(200).json(wealthHistory);
//   } catch (error) {
//     console.error('Error fetching total wealth history:', error);
//     res.status(500).json({ error: 'Error fetching total wealth history' });
//   }
// });


// Route to get the latest total wealth entry for each month (for the area chart)
app.get('/api/total-wealth/history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setMonth(currentDate.getMonth() - 12);

    // Aggregate data to get the latest entry for each month
    const wealthHistory = await TotalWealth.aggregate([
      {
        $match: {
          userId,
          calculationDate: { $gte: oneYearAgo },
        },
      },
      {
        $sort: {
          calculationDate: 1, // Sort by date in ascending order
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$calculationDate" },
            month: { $month: "$calculationDate" },
          },
          totalWealth: { $last: "$totalWealth" },
          totalInvested: { $last: "$totalInvested" },
          calculationDate: { $last: "$calculationDate" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // Format the response data
    const responseData = wealthHistory.map((entry) => ({
      calculationDate: entry.calculationDate,
      totalWealth: entry.totalWealth,
      totalInvested: entry.totalInvested,
    }));

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching total wealth history:', error);
    res.status(500).json({ error: 'Error fetching total wealth history' });
  }
});




















// ******************** FLASK API TEST ********************
// Route to forward prediction requests to Flask
app.post('/api/predict', async (req, res) => {
  try {
    // Forward the request body directly to the Flask API
    const flaskResponse = await axios.post('http://127.0.0.1:5001/predict', req.body);

    // Send the Flask response back to the frontend
    res.status(200).json(flaskResponse.data);
  } catch (error) {
    console.error('Error communicating with Flask API:', error.message);

    // Send a detailed error response
    res.status(500).json({
      error: 'Error communicating with Flask API',
      message: error.message,
      stack: error.stack || null,
    });
  }
});








// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});