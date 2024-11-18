// ***************** CODE BELOW IS THE SAME AS ABOVE BUT WITH LOGS **************

// import React, { useEffect, useState, useCallback } from "react";

// const StockCard = ({ stock, onClick }) => {
//   const {
//     name,
//     ticker,
//     assetType,
//     totalQuantity,
//     averagePurchasePrice,
//     totalCost,
//   } = stock;

//   // State for latest prices and sentiment
//   const [latestPrice, setLatestPrice] = useState({
//     open: null,
//     high: null,
//     low: null,
//     close: null,
//     adjusted_close: null,
//     volume: null,
//     dividend_amount: null,
//     split_coefficient: null,
//   });
//   const [overallSentiment, setOverallSentiment] = useState(0);
//   const [tickerSentiment, setTickerSentiment] = useState(0);
//   const [prediction, setPrediction] = useState(null);

//   // Cache for fetched data
//   const sentimentCache = new Map();
//   const priceCache = new Map();

//   // Fetch sentiment data
//   const fetchSentimentData = useCallback(async () => {
//     if (sentimentCache.has(ticker)) {
//       const cachedSentiment = sentimentCache.get(ticker);
//       setOverallSentiment(cachedSentiment.overallSentiment);
//       setTickerSentiment(cachedSentiment.tickerSentiment);
//       return;
//     }

//     const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
//     try {
//       console.log(`Fetching sentiment data for ${ticker}...`);
//       const response = await fetch(
//         `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${apiKey}`
//       );
//       const data = await response.json();

//       if (data.feed && data.feed.length > 0) {
//         const latestArticle = data.feed[0];
//         const overallSentimentScore =
//           parseFloat(latestArticle.overall_sentiment_score) || 0;
//         const tickerSentimentScore =
//           parseFloat(
//             latestArticle.ticker_sentiment?.[0]?.ticker_sentiment_score
//           ) || 0;

//         console.log(
//           `Fetched sentiment for ${ticker}: Overall ${overallSentimentScore}, Ticker ${tickerSentimentScore}`
//         );

//         setOverallSentiment(overallSentimentScore);
//         setTickerSentiment(tickerSentimentScore);
//         sentimentCache.set(ticker, {
//           overallSentiment: overallSentimentScore,
//           tickerSentiment: tickerSentimentScore,
//         });
//       } else {
//         console.error(
//           `No sentiment data found for ${ticker}. Setting scores to 0.`
//         );
//         setOverallSentiment(0);
//         setTickerSentiment(0);
//       }
//     } catch (err) {
//       console.error("Error fetching sentiment data:", err);
//       setOverallSentiment(0);
//       setTickerSentiment(0);
//     }
//   }, [ticker]);

//   // Fetch price data
//   const fetchPriceData = useCallback(async () => {
//     if (priceCache.has(ticker)) {
//       setLatestPrice(priceCache.get(ticker));
//       return;
//     }

//     const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
//     try {
//       console.log(`Fetching price data for ${ticker}...`);
//       const response = await fetch(
//         `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${apiKey}`
//       );
//       const data = await response.json();

//       if (data["Time Series (Daily)"]) {
//         const latestDate = Object.keys(data["Time Series (Daily)"])[0];
//         const latestData = data["Time Series (Daily)"][latestDate];

//         const priceData = {
//           open: parseFloat(latestData["1. open"]),
//           high: parseFloat(latestData["2. high"]),
//           low: parseFloat(latestData["3. low"]),
//           close: parseFloat(latestData["4. close"]),
//           adjusted_close: parseFloat(latestData["5. adjusted close"]),
//           volume: parseInt(latestData["6. volume"]),
//           dividend_amount: parseFloat(latestData["7. dividend amount"]),
//           split_coefficient: parseFloat(latestData["8. split coefficient"]),
//         };

//         console.log(`Fetched price data for ${ticker}:`, priceData);

//         setLatestPrice(priceData);
//         priceCache.set(ticker, priceData);
//       } else {
//         console.error(`No price data found for ${ticker}.`);
//         setLatestPrice({});
//       }
//     } catch (err) {
//       console.error("Error fetching price data:", err);
//       setLatestPrice({});
//     }
//   }, [ticker]);

//   // Fetch prediction
//   const fetchPrediction = useCallback(async () => {
//     try {
//       const predictionPayload = {
//         overall_sentiment_score: parseFloat(overallSentiment),
//         ticker_sentiment_score: parseFloat(tickerSentiment),
//         open: parseFloat(latestPrice.open),
//         high: parseFloat(latestPrice.high),
//         low: parseFloat(latestPrice.low),
//         close: parseFloat(latestPrice.close),
//         adjusted_close: parseFloat(latestPrice.adjusted_close),
//         volume: parseInt(latestPrice.volume),
//         dividend_amount: parseFloat(latestPrice.dividend_amount),
//         split_coefficient: parseFloat(latestPrice.split_coefficient),
//       };

//       console.log(
//         `Sending prediction request for ${ticker}:`,
//         predictionPayload
//       );

//       const response = await fetch("/api/predict", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(predictionPayload),
//       });

//       const data = await response.json();
//       console.log(`Received prediction for ${ticker}: ${data.prediction}`);

//       setPrediction(data.prediction);
//     } catch (err) {
//       console.error("Error fetching prediction:", err);
//       setPrediction("Error");
//     }
//   }, [overallSentiment, tickerSentiment, latestPrice]);

//   // Effect to fetch sentiment and price data
//   useEffect(() => {
//     if (ticker) {
//       fetchSentimentData();
//       fetchPriceData();
//     }
//   }, [ticker, fetchSentimentData, fetchPriceData]);

//   // Effect to fetch prediction after data is loaded
//   useEffect(() => {
//     if (
//       overallSentiment !== null &&
//       tickerSentiment !== null &&
//       latestPrice.close !== null
//     ) {
//       fetchPrediction();
//     }
//   }, [overallSentiment, tickerSentiment, latestPrice, fetchPrediction]);

//   // Calculate individual stock profit/loss
//   const stockValue = totalQuantity * (latestPrice.close || 0);
//   const profitLoss = stockValue - totalCost;
//   const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

//   return (
//     <div className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
//     <h3 className="text-xl font-bold mb-2">
//       {name} ({ticker})
//     </h3>
//     <p><strong>Asset Type:</strong> {assetType}</p>
//     <p><strong>Total Quantity:</strong> {totalQuantity || 0}</p>
//     <p>
//       <strong>Average Purchase Price:</strong> $
//       {averagePurchasePrice
//         ? averagePurchasePrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//         : "0.00"}
//     </p>
//     <p>
//       <strong>Total Cost:</strong> $
//       {totalCost
//         ? totalCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//         : "0.00"}
//     </p>
//     <p className={profitLoss >= 0 ? "text-green-600" : "text-red-600"}>
//       <strong>Profit/Loss:</strong> $
//       {profitLoss.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (
//       {profitLossPercent.toFixed(2)}%)
//     </p>
//     <p><strong>Predicted Movement:</strong> {prediction || "Loading..."}</p>
//     <div className="mt-4">
//       <h4 className="text-lg font-semibold mb-2">Latest Prices</h4>
//       <p>
//         <strong>Open:</strong> $
//         {latestPrice.open
//           ? latestPrice.open.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//           : "Loading..."}
//       </p>
//       <p>
//         <strong>Close:</strong> $
//         {latestPrice.close
//           ? latestPrice.close.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//           : "Loading..."}
//       </p>
//     </div>
//   </div>
//   );
// };

// export default StockCard;





// Added Sell Stock button
// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// const StockCard = ({ stock, onClick }) => {
//   const {
//     name,
//     ticker,
//     assetType,
//     totalQuantity,
//     averagePurchasePrice,
//     totalCost,
//   } = stock;

//   const navigate = useNavigate();

//   // State for latest prices and sentiment
//   const [latestPrice, setLatestPrice] = useState({
//     open: null,
//     high: null,
//     low: null,
//     close: null,
//     adjusted_close: null,
//     volume: null,
//     dividend_amount: null,
//     split_coefficient: null,
//   });
//   const [overallSentiment, setOverallSentiment] = useState(0);
//   const [tickerSentiment, setTickerSentiment] = useState(0);
//   const [prediction, setPrediction] = useState(null);

//   // Cache for fetched data
//   const sentimentCache = new Map();
//   const priceCache = new Map();

//   // Fetch sentiment data
//   const fetchSentimentData = useCallback(async () => {
//     if (sentimentCache.has(ticker)) {
//       const cachedSentiment = sentimentCache.get(ticker);
//       setOverallSentiment(cachedSentiment.overallSentiment);
//       setTickerSentiment(cachedSentiment.tickerSentiment);
//       return;
//     }

//     const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
//     try {
//       console.log(`Fetching sentiment data for ${ticker}...`);
//       const response = await fetch(
//         `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${apiKey}`
//       );
//       const data = await response.json();

//       if (data.feed && data.feed.length > 0) {
//         const latestArticle = data.feed[0];
//         const overallSentimentScore =
//           parseFloat(latestArticle.overall_sentiment_score) || 0;
//         const tickerSentimentScore =
//           parseFloat(
//             latestArticle.ticker_sentiment?.[0]?.ticker_sentiment_score
//           ) || 0;

//         setOverallSentiment(overallSentimentScore);
//         setTickerSentiment(tickerSentimentScore);
//         sentimentCache.set(ticker, {
//           overallSentiment: overallSentimentScore,
//           tickerSentiment: tickerSentimentScore,
//         });
//       } else {
//         setOverallSentiment(0);
//         setTickerSentiment(0);
//       }
//     } catch (err) {
//       console.error("Error fetching sentiment data:", err);
//       setOverallSentiment(0);
//       setTickerSentiment(0);
//     }
//   }, [ticker]);

//   // Fetch price data
//   const fetchPriceData = useCallback(async () => {
//     if (priceCache.has(ticker)) {
//       setLatestPrice(priceCache.get(ticker));
//       return;
//     }

//     const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
//     try {
//       const response = await fetch(
//         `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${apiKey}`
//       );
//       const data = await response.json();

//       if (data["Time Series (Daily)"]) {
//         const latestDate = Object.keys(data["Time Series (Daily)"])[0];
//         const latestData = data["Time Series (Daily)"][latestDate];

//         const priceData = {
//           open: parseFloat(latestData["1. open"]),
//           high: parseFloat(latestData["2. high"]),
//           low: parseFloat(latestData["3. low"]),
//           close: parseFloat(latestData["4. close"]),
//           adjusted_close: parseFloat(latestData["5. adjusted close"]),
//           volume: parseInt(latestData["6. volume"]),
//           dividend_amount: parseFloat(latestData["7. dividend amount"]),
//           split_coefficient: parseFloat(latestData["8. split coefficient"]),
//         };

//         setLatestPrice(priceData);
//         priceCache.set(ticker, priceData);
//       } else {
//         setLatestPrice({});
//       }
//     } catch (err) {
//       console.error("Error fetching price data:", err);
//       setLatestPrice({});
//     }
//   }, [ticker]);

//   // Fetch prediction
//   const fetchPrediction = useCallback(async () => {
//     try {
//       const predictionPayload = {
//         overall_sentiment_score: parseFloat(overallSentiment),
//         ticker_sentiment_score: parseFloat(tickerSentiment),
//         open: parseFloat(latestPrice.open),
//         high: parseFloat(latestPrice.high),
//         low: parseFloat(latestPrice.low),
//         close: parseFloat(latestPrice.close),
//         adjusted_close: parseFloat(latestPrice.adjusted_close),
//         volume: parseInt(latestPrice.volume),
//         dividend_amount: parseFloat(latestPrice.dividend_amount),
//         split_coefficient: parseFloat(latestPrice.split_coefficient),
//       };

//       const response = await fetch("/api/predict", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(predictionPayload),
//       });

//       const data = await response.json();
//       setPrediction(data.prediction);
//     } catch (err) {
//       console.error("Error fetching prediction:", err);
//       setPrediction("Error");
//     }
//   }, [overallSentiment, tickerSentiment, latestPrice]);

//   useEffect(() => {
//     if (ticker) {
//       fetchSentimentData();
//       fetchPriceData();
//     }
//   }, [ticker, fetchSentimentData, fetchPriceData]);

//   useEffect(() => {
//     if (
//       overallSentiment !== null &&
//       tickerSentiment !== null &&
//       latestPrice.close !== null
//     ) {
//       fetchPrediction();
//     }
//   }, [overallSentiment, tickerSentiment, latestPrice, fetchPrediction]);

//   const stockValue = totalQuantity * (latestPrice.close || 0);
//   const profitLoss = stockValue - totalCost;
//   const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

//   // Handle click for the "Sell" button
//   const handleSellClick = () => {
//     navigate(`/sell-stock`, {
//       state: {
//         ticker,
//         name,
//         totalQuantity,
//         averagePurchasePrice,
//         totalCost,
//       },
//     });
//   };

//   return (
//     <div className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
//       <h3 className="text-xl font-bold mb-2">
//         {name} ({ticker})
//       </h3>
//       <p><strong>Asset Type:</strong> {assetType}</p>
//       <p><strong>Total Quantity:</strong> {totalQuantity || 0}</p>
//       <p><strong>Average Purchase Price:</strong> ${averagePurchasePrice.toFixed(2)}</p>
//       <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
//       <p className={profitLoss >= 0 ? "text-green-600" : "text-red-600"}>
//         <strong>Profit/Loss:</strong> ${profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)
//       </p>
//       <p><strong>Predicted Movement:</strong> {prediction || "Loading..."}</p>
//       <button
//         className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300 mt-4"
//         onClick={handleSellClick}
//       >
//         Sell Stock
//       </button>
//     </div>
//   );
// };

// export default StockCard;




// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// const StockCard = ({ stock, onClick }) => {
//   const { name, ticker, assetType, totalQuantity, averagePurchasePrice, totalCost } = stock;
//   const navigate = useNavigate();

//   // State for latest prices and sentiment
//   const [latestPrice, setLatestPrice] = useState({
//     open: null,
//     high: null,
//     low: null,
//     close: null,
//     adjusted_close: null,
//     volume: null,
//     dividend_amount: null,
//     split_coefficient: null,
//   });
//   const [overallSentiment, setOverallSentiment] = useState(0);
//   const [tickerSentiment, setTickerSentiment] = useState(0);
//   const [prediction, setPrediction] = useState(null);

//   // Fetch sentiment data from backend
//   const fetchSentimentData = useCallback(async () => {
//     try {
//       const response = await fetch(`/api/stock/sentiment/${ticker}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       setOverallSentiment(data.overallSentimentScore || 0);
//       setTickerSentiment(data.tickerSentimentScore || 0);
//     } catch (err) {
//       console.error("Error fetching sentiment data:", err);
//       setOverallSentiment(0);
//       setTickerSentiment(0);
//     }
//   }, [ticker]);

//   // Fetch price data from backend
//   const fetchPriceData = useCallback(async () => {
//     try {
//       const response = await fetch(`/api/stock/latest/${ticker}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       setLatestPrice(data);
//     } catch (err) {
//       console.error("Error fetching price data:", err);
//       setLatestPrice({});
//     }
//   }, [ticker]);

//   // Fetch prediction
//   const fetchPrediction = useCallback(async () => {
//     try {
//       const predictionPayload = {
//         overall_sentiment_score: parseFloat(overallSentiment),
//         ticker_sentiment_score: parseFloat(tickerSentiment),
//         open: parseFloat(latestPrice.open),
//         high: parseFloat(latestPrice.high),
//         low: parseFloat(latestPrice.low),
//         close: parseFloat(latestPrice.close),
//         adjusted_close: parseFloat(latestPrice.adjusted_close),
//         volume: parseInt(latestPrice.volume),
//         dividend_amount: parseFloat(latestPrice.dividend_amount),
//         split_coefficient: parseFloat(latestPrice.split_coefficient),
//       };

//       const response = await fetch("/api/predict", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(predictionPayload),
//       });

//       const data = await response.json();
//       setPrediction(data.prediction);
//     } catch (err) {
//       console.error("Error fetching prediction:", err);
//       setPrediction("Error");
//     }
//   }, [overallSentiment, tickerSentiment, latestPrice]);

//   // Effect to fetch sentiment and price data
//   useEffect(() => {
//     if (ticker) {
//       fetchSentimentData();
//       fetchPriceData();
//     }
//   }, [ticker, fetchSentimentData, fetchPriceData]);

//   // Effect to fetch prediction when data is available
//   useEffect(() => {
//     if (
//       overallSentiment !== null &&
//       tickerSentiment !== null &&
//       latestPrice.close !== null
//     ) {
//       fetchPrediction();
//     }
//   }, [overallSentiment, tickerSentiment, latestPrice, fetchPrediction]);

//   // Calculate stock value and profit/loss
//   const stockValue = totalQuantity * (latestPrice.close || 0);
//   const profitLoss = stockValue - totalCost;
//   const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

//   // Handle click for the "Sell" button
//   const handleSellClick = () => {
//     navigate(`/sell-stock`, {
//       state: {
//         ticker,
//         name,
//         totalQuantity,
//         averagePurchasePrice,
//         totalCost,
//       },
//     });
//   };

//   return (
//     <div className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
//       <h3 className="text-xl font-bold mb-2">
//         {name} ({ticker})
//       </h3>
//       <p><strong>Asset Type:</strong> {assetType}</p>
//       <p><strong>Total Quantity:</strong> {totalQuantity || 0}</p>
//       <p><strong>Average Purchase Price:</strong> ${averagePurchasePrice.toFixed(2)}</p>
//       <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
//       <p className={profitLoss >= 0 ? "text-green-600" : "text-red-600"}>
//         <strong>Profit/Loss:</strong> ${profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)
//       </p>
//       <p><strong>Adjusted Close:</strong> ${latestPrice.adjusted_close || "N/A"}</p>
//       <p><strong>Overall Sentiment:</strong> {overallSentiment.toFixed(2)}</p>
//       <p><strong>Ticker Sentiment:</strong> {tickerSentiment.toFixed(2)}</p>
//       <p><strong>Predicted Movement:</strong> {prediction || "Loading..."}</p>
//       <button
//         className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300 mt-4"
//         onClick={handleSellClick}
//       >
//         Sell Stock
//       </button>
//     </div>
//   );
// };

// export default StockCard;



// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// const StockCard = ({ stock, onClick }) => {
//   const { name, ticker, assetType, totalQuantity, averagePurchasePrice, totalCost } = stock;
//   const navigate = useNavigate();

//   // State for latest prices and sentiment
//   const [latestPrice, setLatestPrice] = useState({
//     open: null,
//     high: null,
//     low: null,
//     close: null,
//     adjusted_close: null,
//     volume: null,
//     dividend_amount: null,
//     split_coefficient: null,
//   });
//   const [overallSentiment, setOverallSentiment] = useState(0);
//   const [tickerSentiment, setTickerSentiment] = useState(0);
//   const [prediction, setPrediction] = useState(null);

//   // Fetch sentiment data from backend
//   const fetchSentimentData = useCallback(async () => {
//     try {
//       const response = await fetch(`/api/stock/sentiment/${ticker}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       setOverallSentiment(data.overallSentimentScore || 0);
//       setTickerSentiment(data.tickerSentimentScore || 0);
//     } catch (err) {
//       console.error("Error fetching sentiment data:", err);
//       setOverallSentiment(0);
//       setTickerSentiment(0);
//     }
//   }, [ticker]);

//   // Fetch price data from backend
//   const fetchPriceData = useCallback(async () => {
//     try {
//       const response = await fetch(`/api/stock/latest/${ticker}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       setLatestPrice(data);
//     } catch (err) {
//       console.error("Error fetching price data:", err);
//       setLatestPrice({});
//     }
//   }, [ticker]);

//   // Fetch prediction
//   const fetchPrediction = useCallback(async () => {
//     try {
//       const predictionPayload = {
//         overall_sentiment_score: parseFloat(overallSentiment),
//         ticker_sentiment_score: parseFloat(tickerSentiment),
//         open: parseFloat(latestPrice.open),
//         high: parseFloat(latestPrice.high),
//         low: parseFloat(latestPrice.low),
//         close: parseFloat(latestPrice.close),
//         adjusted_close: parseFloat(latestPrice.adjusted_close),
//         volume: parseInt(latestPrice.volume),
//         dividend_amount: parseFloat(latestPrice.dividend_amount),
//         split_coefficient: parseFloat(latestPrice.split_coefficient),
//       };

//       const response = await fetch("/api/predict", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(predictionPayload),
//       });

//       const data = await response.json();
//       setPrediction(data.prediction);
//     } catch (err) {
//       console.error("Error fetching prediction:", err);
//       setPrediction("Error");
//     }
//   }, [overallSentiment, tickerSentiment, latestPrice]);

//   // Effect to fetch sentiment and price data
//   useEffect(() => {
//     if (ticker) {
//       fetchSentimentData();
//       fetchPriceData();
//     }
//   }, [ticker, fetchSentimentData, fetchPriceData]);

//   // Effect to fetch prediction when data is available
//   useEffect(() => {
//     if (
//       overallSentiment !== null &&
//       tickerSentiment !== null &&
//       latestPrice.close !== null
//     ) {
//       fetchPrediction();
//     }
//   }, [overallSentiment, tickerSentiment, latestPrice, fetchPrediction]);

//   // Calculate stock value, profit/loss, and current total value
//   const stockValue = totalQuantity * (latestPrice.close || 0);
//   const profitLoss = stockValue - totalCost;
//   const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;
//   const currentTotalValue = totalQuantity * (latestPrice.close || 0);

//   // Handle click for the "Sell" button
//   const handleSellClick = () => {
//     navigate(`/sell-stock`, {
//       state: {
//         ticker,
//         name,
//         totalQuantity,
//         averagePurchasePrice,
//         totalCost,
//       },
//     });
//   };

//   return (
//     <div className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
//       <h3 className="text-xl font-bold mb-2">
//         {name} ({ticker})
//       </h3>
//       <p><strong>Asset Type:</strong> {assetType}</p>
//       <p><strong>Total Quantity:</strong> {totalQuantity || 0}</p>
//       <p><strong>Average Purchase Price:</strong> ${averagePurchasePrice.toFixed(2)}</p>
//       <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
//       <p><strong>Current Total Value:</strong> ${currentTotalValue.toFixed(2)}</p>
//       <p className={profitLoss >= 0 ? "text-green-600" : "text-red-600"}>
//         <strong>Profit/Loss:</strong> ${profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)
//       </p>
//       <p><strong>Adjusted Close:</strong> ${latestPrice.adjusted_close || "N/A"}</p>
//       <p><strong>Overall Sentiment:</strong> {overallSentiment.toFixed(2)}</p>
//       <p><strong>Ticker Sentiment:</strong> {tickerSentiment.toFixed(2)}</p>
//       <p><strong>Predicted Movement:</strong> {prediction || "Loading..."}</p>
      
//       <button
//         className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300 mt-4"
//         onClick={handleSellClick}
//       >
//         Sell Stock
//       </button>
//     </div>
//   );
// };

// export default StockCard;





// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// const StockCard = ({ stock, onClick }) => {
//   const { name, ticker, assetType, totalQuantity, averagePurchasePrice, totalCost } = stock;
//   const navigate = useNavigate();

//   // State for latest prices and sentiment
//   const [latestPrice, setLatestPrice] = useState({
//     open: null,
//     high: null,
//     low: null,
//     close: null,
//     adjusted_close: null,
//     volume: null,
//     dividend_amount: null,
//     split_coefficient: null,
//   });
//   const [overallSentiment, setOverallSentiment] = useState(0);
//   const [tickerSentiment, setTickerSentiment] = useState(0);
//   const [prediction, setPrediction] = useState(null);

//   // Fetch sentiment data from backend
//   const fetchSentimentData = useCallback(async () => {
//     try {
//       const response = await fetch(`/api/stock/sentiment/${ticker}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       setOverallSentiment(data.overallSentimentScore || 0);
//       setTickerSentiment(data.tickerSentimentScore || 0);
//     } catch (err) {
//       console.error("Error fetching sentiment data:", err);
//       setOverallSentiment(0);
//       setTickerSentiment(0);
//     }
//   }, [ticker]);

//   // Fetch price data from backend
//   const fetchPriceData = useCallback(async () => {
//     try {
//       const response = await fetch(`/api/stock/latest/${ticker}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       setLatestPrice(data);
//     } catch (err) {
//       console.error("Error fetching price data:", err);
//       setLatestPrice({});
//     }
//   }, [ticker]);

//   // Fetch prediction
//   const fetchPrediction = useCallback(async () => {
//     try {
//       const predictionPayload = {
//         overall_sentiment_score: parseFloat(overallSentiment),
//         ticker_sentiment_score: parseFloat(tickerSentiment),
//         open: parseFloat(latestPrice.open),
//         high: parseFloat(latestPrice.high),
//         low: parseFloat(latestPrice.low),
//         close: parseFloat(latestPrice.close),
//         adjusted_close: parseFloat(latestPrice.adjusted_close),
//         volume: parseInt(latestPrice.volume),
//         dividend_amount: parseFloat(latestPrice.dividend_amount),
//         split_coefficient: parseFloat(latestPrice.split_coefficient),
//       };

//       const response = await fetch("/api/predict", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(predictionPayload),
//       });

//       const data = await response.json();
//       setPrediction(data.prediction);
//     } catch (err) {
//       console.error("Error fetching prediction:", err);
//       setPrediction("Error");
//     }
//   }, [overallSentiment, tickerSentiment, latestPrice]);

//   // Effect to fetch sentiment and price data
//   useEffect(() => {
//     if (ticker) {
//       fetchSentimentData();
//       fetchPriceData();
//     }
//   }, [ticker, fetchSentimentData, fetchPriceData]);

//   // Effect to fetch prediction when data is available
//   useEffect(() => {
//     if (
//       overallSentiment !== null &&
//       tickerSentiment !== null &&
//       latestPrice.close !== null
//     ) {
//       fetchPrediction();
//     }
//   }, [overallSentiment, tickerSentiment, latestPrice, fetchPrediction]);

//   // Calculate stock value, profit/loss, and current total value
//   const stockValue = totalQuantity * (latestPrice.close || 0);
//   const profitLoss = stockValue - totalCost;
//   const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;
//   const currentTotalValue = totalQuantity * (latestPrice.close || 0);

//   // Format numbers with thousand separators
//   const formatCurrency = (value) => {
//     return value.toLocaleString("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 2,
//     });
//   };

//   // Handle click for the "Sell" button
//   const handleSellClick = () => {
//     navigate(`/sell-stock`, {
//       state: {
//         ticker,
//         name,
//         totalQuantity,
//         averagePurchasePrice,
//         totalCost,
//       },
//     });
//   };

//   return (
//     <div className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
//       <h3 className="text-xl font-bold mb-2">
//         {name} ({ticker})
//       </h3>
//       <p><strong>Asset Type:</strong> {assetType}</p>
//       <p><strong>Total Quantity:</strong> {totalQuantity.toLocaleString("en-US")}</p>
//       <p><strong>Average Purchase Price:</strong> {formatCurrency(averagePurchasePrice)}</p>
//       <p><strong>Total Cost:</strong> {formatCurrency(totalCost)}</p>
//       <p><strong>Current Total Value:</strong> {formatCurrency(currentTotalValue)}</p>
//       <p className={profitLoss >= 0 ? "text-green-600" : "text-red-600"}>
//         <strong>Profit/Loss:</strong> {formatCurrency(profitLoss)} ({profitLossPercent.toFixed(2)}%)
//       </p>
//       <p><strong>Adjusted Close:</strong> {formatCurrency(latestPrice.adjusted_close || 0)}</p>
//       <p><strong>Overall Sentiment:</strong> {overallSentiment.toFixed(2)}</p>
//       <p><strong>Ticker Sentiment:</strong> {tickerSentiment.toFixed(2)}</p>
//       <p><strong>Predicted Movement:</strong> {prediction || "Loading..."}</p>
      
//       <button
//         className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300 mt-4"
//         onClick={handleSellClick}
//       >
//         Sell Stock
//       </button>
//     </div>
//   );
// };

// export default StockCard;




import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const StockCard = ({ stock, onClick }) => {
  const { name, ticker, assetType, totalQuantity, averagePurchasePrice, totalCost } = stock;
  const navigate = useNavigate();

  // State for latest prices and sentiment
  const [latestPrice, setLatestPrice] = useState({
    open: null,
    high: null,
    low: null,
    close: null,
    adjusted_close: null,
    volume: null,
    dividend_amount: null,
    split_coefficient: null,
  });
  const [intradayPrice, setIntradayPrice] = useState(null);
  const [overallSentiment, setOverallSentiment] = useState(0);
  const [tickerSentiment, setTickerSentiment] = useState(0);
  const [prediction, setPrediction] = useState(null);

  // Fetch sentiment data from backend
  const fetchSentimentData = useCallback(async () => {
    try {
      const response = await fetch(`/api/stock/sentiment/${ticker}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setOverallSentiment(data.overallSentimentScore || 0);
      setTickerSentiment(data.tickerSentimentScore || 0);
    } catch (err) {
      console.error("Error fetching sentiment data:", err);
      setOverallSentiment(0);
      setTickerSentiment(0);
    }
  }, [ticker]);

  // Fetch daily adjusted price data
  const fetchPriceData = useCallback(async () => {
    try {
      const response = await fetch(`/api/stock/latest/${ticker}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setLatestPrice(data);
    } catch (err) {
      console.error("Error fetching price data:", err);
      setLatestPrice({});
    }
  }, [ticker]);

  // Fetch intraday price data
  const fetchIntradayPrice = useCallback(async () => {
    try {
      const response = await fetch(`/api/stock/intraday/${ticker}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setIntradayPrice(data.close || null);
    } catch (err) {
      console.error("Error fetching intraday price:", err);
      setIntradayPrice(null);
    }
  }, [ticker]);

  // Fetch prediction
  const fetchPrediction = useCallback(async () => {
    try {
      const predictionPayload = {
        overall_sentiment_score: parseFloat(overallSentiment),
        ticker_sentiment_score: parseFloat(tickerSentiment),
        open: parseFloat(latestPrice.open),
        high: parseFloat(latestPrice.high),
        low: parseFloat(latestPrice.low),
        close: parseFloat(latestPrice.close),
        adjusted_close: parseFloat(latestPrice.adjusted_close),
        volume: parseInt(latestPrice.volume),
        dividend_amount: parseFloat(latestPrice.dividend_amount),
        split_coefficient: parseFloat(latestPrice.split_coefficient),
      };

      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(predictionPayload),
      });

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      console.error("Error fetching prediction:", err);
      setPrediction("Error");
    }
  }, [overallSentiment, tickerSentiment, latestPrice]);

  // Effect to fetch sentiment, daily price, and intraday price data
  useEffect(() => {
    if (ticker) {
      fetchSentimentData();
      fetchPriceData();
      fetchIntradayPrice();
    }
  }, [ticker, fetchSentimentData, fetchPriceData, fetchIntradayPrice]);

  // Effect to fetch prediction when data is available
  useEffect(() => {
    if (
      overallSentiment !== null &&
      tickerSentiment !== null &&
      latestPrice.close !== null
    ) {
      fetchPrediction();
    }
  }, [overallSentiment, tickerSentiment, latestPrice, fetchPrediction]);

  // Calculate stock value, profit/loss, and current total value
  const currentPrice = intradayPrice || latestPrice.close || 0;
  const stockValue = totalQuantity * currentPrice;
  const profitLoss = stockValue - totalCost;
  const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

  // Format numbers with thousand separators
  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  };

  // Handle click for the "Sell" button
  const handleSellClick = () => {
    navigate(`/sell-stock`, {
      state: {
        ticker,
        name,
        totalQuantity,
        averagePurchasePrice,
        totalCost,
      },
    });
  };

  return (
    <div className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <h3 className="text-xl font-bold mb-2">{name} ({ticker})</h3>
      <p><strong>Asset Type:</strong> {assetType}</p>
      <p><strong>Total Quantity:</strong> {totalQuantity.toLocaleString("en-US")}</p>
      <p><strong>Average Purchase Price:</strong> {formatCurrency(averagePurchasePrice)}</p>
      <p><strong>Total Cost:</strong> {formatCurrency(totalCost)}</p>
      <p><strong>Current Price:</strong> {formatCurrency(currentPrice)}</p>
      <p><strong>Current Total Value:</strong> {formatCurrency(stockValue)}</p>
      <p className={profitLoss >= 0 ? "text-green-600" : "text-red-600"}>
        <strong>Profit/Loss:</strong> {formatCurrency(profitLoss)} ({profitLossPercent.toFixed(2)}%)
      </p>
      <p><strong>Adjusted Close:</strong> {formatCurrency(latestPrice.adjusted_close || 0)}</p>
      <p><strong>Overall Sentiment:</strong> {overallSentiment.toFixed(2)}</p>
      <p><strong>Ticker Sentiment:</strong> {tickerSentiment.toFixed(2)}</p>
      <p><strong>Predicted Movement:</strong> {prediction || "Loading..."}</p>

      <button
        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300 mt-4"
        onClick={handleSellClick}
      >
        Sell Stock
      </button>
    </div>
  );
};

export default StockCard;
