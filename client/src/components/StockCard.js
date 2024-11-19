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
//   const [intradayPrice, setIntradayPrice] = useState(null);
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

//   // Fetch daily adjusted price data
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

//   // Fetch intraday price data
//   const fetchIntradayPrice = useCallback(async () => {
//     try {
//       const response = await fetch(`/api/stock/intraday/${ticker}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       setIntradayPrice(data.close || null);
//     } catch (err) {
//       console.error("Error fetching intraday price:", err);
//       setIntradayPrice(null);
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

//   // Effect to fetch sentiment, daily price, and intraday price data
//   useEffect(() => {
//     if (ticker) {
//       fetchSentimentData();
//       fetchPriceData();
//       fetchIntradayPrice();
//     }
//   }, [ticker, fetchSentimentData, fetchPriceData, fetchIntradayPrice]);

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
//   const currentPrice = intradayPrice || latestPrice.close || 0;
//   const stockValue = totalQuantity * currentPrice;
//   const profitLoss = stockValue - totalCost;
//   const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

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
//       <h3 className="text-xl font-bold mb-2">{name} ({ticker})</h3>
//       <p><strong>Asset Type:</strong> {assetType}</p>
//       <p><strong>Total Quantity:</strong> {totalQuantity.toLocaleString("en-US")}</p>
//       <p><strong>Average Purchase Price:</strong> {formatCurrency(averagePurchasePrice)}</p>
//       <p><strong>Total Cost:</strong> {formatCurrency(totalCost)}</p>
//       <p><strong>Current Price:</strong> {formatCurrency(currentPrice)}</p>
//       <p><strong>Current Total Value:</strong> {formatCurrency(stockValue)}</p>
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




// Using cached data from UserContext
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";

const StockCard = ({ stock, onClick }) => {
  const { fetchStockData } = useAuth();
  const { name, ticker, assetType, totalQuantity, averagePurchasePrice, totalCost } = stock;
  const navigate = useNavigate();

  // State for latest prices, intraday price, sentiment, and prediction
  const [latestPrice, setLatestPrice] = useState({});
  const [intradayPrice, setIntradayPrice] = useState(null);
  const [overallSentiment, setOverallSentiment] = useState(0);
  const [tickerSentiment, setTickerSentiment] = useState(0);
  const [prediction, setPrediction] = useState(null);

  // Fetch all stock data (prices, sentiment) using fetchStockData from UserContext
  const fetchAllData = useCallback(async () => {
    try {
      const stockData = await fetchStockData(ticker);
      if (stockData) {
        const { price, intraday, sentiment } = stockData;

        setLatestPrice(price || {});
        setIntradayPrice(intraday?.close || null);
        setOverallSentiment(sentiment?.overallSentimentScore || 0);
        setTickerSentiment(sentiment?.tickerSentimentScore || 0);
      }
    } catch (err) {
      console.error(`Error fetching data for ${ticker}:`, err);
      setLatestPrice({});
      setIntradayPrice(null);
      setOverallSentiment(0);
      setTickerSentiment(0);
    }
  }, [ticker, fetchStockData]);

  // Fetch prediction data based on available stock data
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

  // Effect to fetch all data when the component mounts
  useEffect(() => {
    if (ticker) {
      fetchAllData();
    }
  }, [ticker, fetchAllData]);

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
