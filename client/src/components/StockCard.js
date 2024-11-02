// Stock Card showing Open and Close price
// import React, { useEffect, useState } from "react";

// const StockCard = ({ stock, onClick }) => {
//   const {
//     name,
//     ticker,
//     assetType,
//     quantity,
//     purchasePrice,
//     brokerageFees,
//     totalQuantity,
//     averagePurchasePrice,
//     totalCost
//   } = stock;

//   // State for latest prices
//   const [latestPrice, setLatestPrice] = useState({ open: null, close: null });
//   const [error, setError] = useState(null);

//   // Fetch latest prices from the backend
//   useEffect(() => {
//     const fetchLatestPrice = async () => {
//       try {
//         const response = await fetch(`/api/stock/latest/${ticker}`);
//         const data = await response.json();

//         if (response.ok) {
//           setLatestPrice({ open: data.open, close: data.close });
//         } else {
//           setError(data.error || 'Failed to fetch latest price');
//         }
//       } catch (err) {
//         setError('Error fetching latest price');
//         console.error(err);
//       }
//     };

//     if (ticker) {
//       fetchLatestPrice();
//     }
//   }, [ticker]);

//   return (
//     <div
//       className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg transition-shadow"
//       onClick={onClick}
//     >
//       <h3 className="text-xl font-bold mb-2">{name} ({ticker})</h3>
//       <p><strong>Asset Type:</strong> {assetType}</p>

//       {totalQuantity !== undefined ? (
//         // Display aggregated data
//         <>
//           <p><strong>Total Quantity:</strong> {totalQuantity || 0}</p>
//           <p>
//             <strong>Average Purchase Price:</strong> $
//             {averagePurchasePrice ?
//               averagePurchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :
//               "0.00"}
//           </p>
//           <p>
//             <strong>Total Cost:</strong> $
//             {totalCost ?
//               totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :
//               "0.00"}
//           </p>
//         </>
//       ) : (
//         // Display individual purchase data
//         <>
//           <p><strong>Purchase Date:</strong> {new Date(stock.purchaseDate).toLocaleDateString()}</p>
//           <p><strong>Quantity:</strong> {quantity}</p>
//           <p><strong>Purchase Price:</strong> ${purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//           <p><strong>Brokerage Fees:</strong> ${brokerageFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//           <p><strong>Total Cost:</strong> ${((purchasePrice * quantity) + brokerageFees).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//         </>
//       )}

//       {/* Display latest price information */}
//       <div className="mt-4">
//         <h4 className="text-lg font-semibold mb-2">Latest Prices</h4>
//         {error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           <>
//             <p><strong>Open:</strong> {latestPrice.open !== null ? `$${latestPrice.open.toFixed(2)}` : "Loading..."}</p>
//             <p><strong>Close:</strong> {latestPrice.close !== null ? `$${latestPrice.close.toFixed(2)}` : "Loading..."}</p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StockCard;

import React, { useEffect, useState } from "react";

const StockCard = ({ stock, onClick }) => {
  const {
    name,
    ticker,
    assetType,
    totalQuantity,
    averagePurchasePrice,
    totalCost,
  } = stock;

  // State for latest prices
  const [latestPrice, setLatestPrice] = useState({ open: null, close: null });
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null); // ******************** FLASK API TEST ********************

  // Fetch latest prices from the backend
  useEffect(() => {
    const fetchLatestPrice = async () => {
      try {
        const response = await fetch(`/api/stock/latest/${ticker}`);
        const data = await response.json();

        if (response.ok) {
          setLatestPrice({ open: data.open, close: data.close });
        } else {
          setError(data.error || "Failed to fetch latest price");
        }
      } catch (err) {
        setError("Error fetching latest price");
        console.error(err);
      }
    };

    if (ticker) {
      fetchLatestPrice();
    }
  }, [ticker]);

  // ******************** FLASK API TEST ********************
  // Fetch prediction for price movement
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await fetch("/api/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            overall_sentiment_score: 0.4, // replace with real data if available
            ticker_sentiment_score: 0.3, // replace with real data if available
          }),
        });

        const data = await response.json();
        setPrediction(data.prediction); // Set prediction based on Flask API response
      } catch (err) {
        console.error("Error fetching prediction:", err);
      }
    };

    if (ticker) {
      fetchPrediction();
    }
  }, [ticker]);

  // Calculate individual stock profit/loss
  const stockValue = totalQuantity * (latestPrice.close || 0);
  const profitLoss = stockValue - totalCost;
  const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

  return (
    <div
      className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <h3 className="text-xl font-bold mb-2">
        {name} ({ticker})
      </h3>
      <p>
        <strong>Asset Type:</strong> {assetType}
      </p>
      <p>
        <strong>Total Quantity:</strong> {totalQuantity || 0}
      </p>
      <p>
        <strong>Average Purchase Price:</strong> $
        {averagePurchasePrice
          ? averagePurchasePrice.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })
          : "0.00"}
      </p>
      <p>
        <strong>Total Cost:</strong> $
        {totalCost
          ? totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })
          : "0.00"}
      </p>

      {/* Display individual profit/loss */}
      <p className={profitLoss >= 0 ? "text-green-600" : "text-red-600"}>
        <strong>Profit/Loss:</strong> $
        {profitLoss.toLocaleString("en-US", { minimumFractionDigits: 2 })}(
        {profitLossPercent.toFixed(2)}%)
      </p>

      {/* ******************** FLASK API TEST ******************** */}
      {/* Display prediction for price movement */}
      <p>
        <strong>Predicted Movement:</strong> {prediction || "Loading..."}
      </p>

      {/* Display latest price information */}
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Latest Prices</h4>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p>
              <strong>Open:</strong>{" "}
              {latestPrice.open !== null
                ? `$${latestPrice.open.toFixed(2)}`
                : "Loading..."}
            </p>
            <p>
              <strong>Close:</strong>{" "}
              {latestPrice.close !== null
                ? `$${latestPrice.close.toFixed(2)}`
                : "Loading..."}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default StockCard;
