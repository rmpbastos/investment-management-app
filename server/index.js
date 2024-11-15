const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Portfolio = require('./models/Portfolio');
const DailyStockPrice = require('./models/DailyStockPrice');
const UserProfile = require('./models/UserProfile');
const TotalWealth = require('./models/TotalWealth');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // ******************** FLASK API TEST ********************


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
  const { userId, stock } = req.body;

  try {
    // Find the user's portfolio
    let portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      portfolio = new Portfolio({ userId, stocks: [stock] });
    } else {
      portfolio.stocks.push(stock);
    }

    await portfolio.save();

    // Update total wealth after saving the portfolio
    try {
      const updateResponse = await axios.post('http://localhost:5000/api/total-wealth/update', { userId });
      console.log('Total wealth updated:', updateResponse.data);
    } catch (updateError) {
      console.error('Error updating total wealth:', updateError.response?.data || updateError.message);
    }

    res.json({ message: 'Stock added to portfolio and total wealth updated' });
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
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);  // Set to start of today

//   try {
//     // Check if total wealth is already calculated for today
//     const existingWealth = await TotalWealth.findOne({
//       userId,
//       calculationDate: { $gte: today }  // Check if there's an entry for today
//     });

//     if (existingWealth) {
//       console.log(`Total wealth already calculated for today for userId: ${userId}`);
//       return res.status(200).json({
//         message: 'Total wealth already calculated for today',
//         totalWealth: existingWealth.totalWealth
//       });
//     }

//     // Fetch the user's portfolio
//     const portfolio = await Portfolio.findOne({ userId });
//     if (!portfolio || portfolio.stocks.length === 0) {
//       return res.status(404).json({ error: 'No portfolio found or portfolio is empty' });
//     }

//     // Calculate total wealth
//     let totalWealth = 0;
//     for (const stock of portfolio.stocks) {
//       const { ticker, quantity } = stock;

//       // Fetch the latest stock price from the DailyStockPrice collection
//       let latestPrice = await DailyStockPrice.findOne({ ticker }).sort({ date: -1 });

//       // If there's no price data, fetch from Tiingo
//       if (!latestPrice) {
//         console.log(`No local price data found for ${ticker}, fetching from Tiingo...`);

//         try {
//           const response = await axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}/prices`, {
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Token ${apiKey}`,
//             },
//           });

//           if (response.data && response.data.length > 0) {
//             const { open, close } = response.data[0];  // Take the most recent price data
//             latestPrice = new DailyStockPrice({ ticker, open, close, date: new Date() });
//             await latestPrice.save();  // Save the fetched price to the database
//             console.log(`Price data saved for ${ticker}.`);
//           } else {
//             console.log(`No price data found for ${ticker} from Tiingo.`);
//             continue;  // Skip this stock if no data is found
//           }
//         } catch (apiError) {
//           console.error(`Error fetching price for ${ticker} from Tiingo:`, apiError.message);
//           continue;  // Skip this stock if there's an error fetching data
//         }
//       }

//       // Calculate total wealth using the latest price
//       if (latestPrice && latestPrice.close) {
//         totalWealth += latestPrice.close * quantity;
//       }
//     }

//     // If total wealth remains zero, return a warning
//     if (totalWealth === 0) {
//       console.log(`Total wealth remains zero for userId: ${userId}.`);
//       return res.status(400).json({ error: 'Total wealth could not be calculated.' });
//     }

//     // Create a new TotalWealth entry
//     const userWealth = new TotalWealth({
//       userId,
//       totalWealth,
//       calculationDate: new Date(),
//     });

//     await userWealth.save();
//     res.status(201).json({ message: 'Total wealth calculated and stored successfully', totalWealth });
//   } catch (error) {
//     console.error('Error calculating total wealth:', error);
//     res.status(500).json({ error: 'Error calculating total wealth' });
//   }
// });


// app.post('/api/total-wealth/update', async (req, res) => {
//   const { userId } = req.body;
//   const apiKey = process.env.TIINGO_API_KEY;

//   try {
//     // Fetch the user's portfolio
//     const portfolio = await Portfolio.findOne({ userId });
//     if (!portfolio || portfolio.stocks.length === 0) {
//       return res.status(404).json({ error: 'No portfolio found or portfolio is empty' });
//     }

//     // Calculate total wealth
//     let totalWealth = 0;
//     for (const stock of portfolio.stocks) {
//       const { ticker, quantity } = stock;
//       let latestPrice = await DailyStockPrice.findOne({ ticker }).sort({ date: -1 });

//       // If there's no price data, fetch from Tiingo
//       if (!latestPrice) {
//         console.log(`No local price data found for ${ticker}, fetching from Tiingo...`);

//         try {
//           const response = await axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}/prices`, {
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Token ${apiKey}`,
//             },
//           });

//           // Log the response for debugging
//           // console.log(`Tiingo API response for ${ticker}:`, response.data);

//           if (response.data && response.data.length > 0) {
//             const { open, close, date } = response.data[0];

//             // Check for missing fields and handle them
//             if (open === undefined || close === undefined || date === undefined) {
//               console.error(`Missing required price data for ${ticker}. Skipping this stock.`);
//               continue; // Skip saving this stock's data
//             }

//             // Create and save the latest price data
//             latestPrice = new DailyStockPrice({
//               ticker,
//               open: open || 0, // Provide a default value if `open` is missing
//               close,
//               date: new Date(date),
//             });
//             await latestPrice.save();
//             console.log(`Price data saved for ${ticker}.`);
//           } else {
//             console.log(`No price data found for ${ticker} from Tiingo.`);
//             continue; // Skip this stock if no data is found
//           }
//         } catch (apiError) {
//           console.error(`Error fetching price for ${ticker} from Tiingo:`, apiError.message);
//           continue; // Skip this stock if there's an error fetching data
//         }
//       }

//       // Calculate total wealth using the latest price
//       if (latestPrice && latestPrice.close) {
//         totalWealth += latestPrice.close * quantity;
//       }
//     }

//     // If total wealth remains zero, return a warning
//     if (totalWealth === 0) {
//       console.log(`Total wealth remains zero for userId: ${userId}.`);
//       return res.status(400).json({ error: 'Total wealth could not be calculated.' });
//     }

//     // Update or create the TotalWealth entry
//     const userWealth = await TotalWealth.findOneAndUpdate(
//       { userId },
//       { totalWealth, calculationDate: new Date() },
//       { upsert: true, new: true }
//     );

//     res.status(200).json({ message: 'Total wealth calculated and updated successfully', totalWealth: userWealth.totalWealth });
//   } catch (error) {
//     console.error('Error calculating total wealth:', error);
//     res.status(500).json({ error: 'Error calculating total wealth' });
//   }
// });


// Updated route to include totalInvested
// app.post('/api/total-wealth/update', async (req, res) => {
//   const { userId } = req.body;
//   const apiKey = process.env.TIINGO_API_KEY;

//   try {
//     // Fetch the user's portfolio
//     const portfolio = await Portfolio.findOne({ userId });
//     if (!portfolio || portfolio.stocks.length === 0) {
//       return res.status(404).json({ error: 'No portfolio found or portfolio is empty' });
//     }

//     // Calculate total wealth and total invested
//     let totalWealth = 0;
//     let totalInvested = 0;

//     for (const stock of portfolio.stocks) {
//       const { ticker, quantity, purchasePrice, brokerageFees } = stock;
//       let latestPrice = await DailyStockPrice.findOne({ ticker }).sort({ date: -1 });

//       // If there's no price data, fetch from Tiingo
//       if (!latestPrice) {
//         console.log(`No local price data found for ${ticker}, fetching from Tiingo...`);

//         try {
//           const response = await axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}/prices`, {
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Token ${apiKey}`,
//             },
//           });

//           console.log(`Tiingo API response for ${ticker}:`, response.data);

//           if (response.data && response.data.length > 0) {
//             const { open, close, date } = response.data[0];

//             if (open === undefined || close === undefined || date === undefined) {
//               console.error(`Missing required price data for ${ticker}. Skipping this stock.`);
//               continue;
//             }

//             latestPrice = new DailyStockPrice({
//               ticker,
//               open: open || 0,
//               close,
//               date: new Date(date),
//             });
//             await latestPrice.save();
//             console.log(`Price data saved for ${ticker}.`);
//           } else {
//             console.log(`No price data found for ${ticker} from Tiingo.`);
//             continue;
//           }
//         } catch (apiError) {
//           console.error(`Error fetching price for ${ticker} from Tiingo:`, apiError.message);
//           continue;
//         }
//       }

//       // Calculate total wealth using the latest price
//       if (latestPrice && latestPrice.close) {
//         totalWealth += latestPrice.close * quantity;
//       }

//       // Calculate total invested (cost of the stock including brokerage fees)
//       totalInvested += (quantity * purchasePrice) + brokerageFees;
//     }

//     // If total wealth remains zero, return a warning
//     if (totalWealth === 0) {
//       console.log(`Total wealth remains zero for userId: ${userId}.`);
//       return res.status(400).json({ error: 'Total wealth could not be calculated.' });
//     }

//     // Update or create the TotalWealth entry with totalInvested
//     const userWealth = await TotalWealth.findOneAndUpdate(
//       { userId },
//       { totalWealth, totalInvested, calculationDate: new Date() },
//       { upsert: true, new: true }
//     );

//     res.status(200).json({ message: 'Total wealth and total invested calculated and updated successfully', totalWealth: userWealth.totalWealth, totalInvested: userWealth.totalInvested });
//   } catch (error) {
//     console.error('Error calculating total wealth:', error);
//     res.status(500).json({ error: 'Error calculating total wealth' });
//   }
// });


// app.post('/api/total-wealth/update', async (req, res) => {
//   const { userId } = req.body;
//   const apiKey = process.env.TIINGO_API_KEY;

//   try {
//     // Fetch the user's portfolio
//     const portfolio = await Portfolio.findOne({ userId });
//     if (!portfolio || portfolio.stocks.length === 0) {
//       return res.status(404).json({ error: 'No portfolio found or portfolio is empty' });
//     }

//     // Calculate total wealth and total invested
//     let totalWealth = 0;
//     let totalInvested = 0;

//     for (const stock of portfolio.stocks) {
//       const { ticker, quantity, purchasePrice, brokerageFees } = stock;
//       let latestPrice = await DailyStockPrice.findOne({ ticker }).sort({ date: -1 });

//       // Fetch price data from Tiingo if not available locally
//       if (!latestPrice) {
//         console.log(`No local price data found for ${ticker}, fetching from Tiingo...`);

//         try {
//           const response = await axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}/prices`, {
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Token ${apiKey}`,
//             },
//           });

//           if (response.data && response.data.length > 0) {
//             const { open, close, date } = response.data[0];
//             latestPrice = new DailyStockPrice({ ticker, open, close, date: new Date(date) });
//             await latestPrice.save();
//             console.log(`Price data saved for ${ticker}.`);
//           } else {
//             console.log(`No price data found for ${ticker} from Tiingo.`);
//             continue;
//           }
//         } catch (error) {
//           console.error(`Error fetching price for ${ticker} from Tiingo:`, error.message);
//           continue;
//         }
//       }

//       // Calculate total wealth and total invested
//       if (latestPrice && latestPrice.close) {
//         totalWealth += latestPrice.close * quantity;
//       }

//       totalInvested += (quantity * purchasePrice) + brokerageFees;
//     }

//     // Check if total wealth is zero and handle accordingly
//     if (totalWealth === 0) {
//       console.log(`Total wealth remains zero for userId: ${userId}.`);
//       return res.status(400).json({ error: 'Total wealth could not be calculated.' });
//     }

//     // Update the existing TotalWealth entry (do not create a new one)
//     const userWealth = await TotalWealth.findOneAndUpdate(
//       { userId },
//       { totalWealth, totalInvested, calculationDate: new Date() },
//       { new: true } // Do not use `upsert: true` to avoid creating new entries
//     );

//     if (!userWealth) {
//       return res.status(404).json({ error: 'Total wealth entry not found for this user.' });
//     }

//     res.status(200).json({
//       message: 'Total wealth and total invested updated successfully',
//       totalWealth: userWealth.totalWealth,
//       totalInvested: userWealth.totalInvested,
//     });
//   } catch (error) {
//     console.error('Error updating total wealth:', error);
//     res.status(500).json({ error: 'Error updating total wealth' });
//   }
// });


app.post('/api/total-wealth/update', async (req, res) => {
  const { userId } = req.body;
  const apiKey = process.env.TIINGO_API_KEY;

  try {
    // Fetch the user's portfolio
    const portfolio = await Portfolio.findOne({ userId });

    // If the portfolio is not found or is empty, return a default response
    if (!portfolio || portfolio.stocks.length === 0) {
      console.log(`Portfolio is empty for userId: ${userId}. Returning default wealth values.`);
      return res.status(200).json({ totalWealth: 0, totalInvested: 0 });
    }

    // Calculate total wealth and total invested
    let totalWealth = 0;
    let totalInvested = 0;

    for (const stock of portfolio.stocks) {
      const { ticker, quantity, purchasePrice, brokerageFees } = stock;
      let latestPrice = await DailyStockPrice.findOne({ ticker }).sort({ date: -1 });

      if (!latestPrice) {
        console.log(`No local price data found for ${ticker}, fetching from Tiingo...`);

        try {
          const response = await axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}/prices`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${apiKey}`,
            },
          });

          if (response.data && response.data.length > 0) {
            const { close, date } = response.data[0];
            latestPrice = new DailyStockPrice({ ticker, close, date: new Date(date) });
            await latestPrice.save();
          } else {
            continue;
          }
        } catch (apiError) {
          console.error(`Error fetching price for ${ticker} from Tiingo:`, apiError.message);
          continue;
        }
      }

      totalWealth += latestPrice.close * quantity;
      totalInvested += (quantity * purchasePrice) + brokerageFees;
    }

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