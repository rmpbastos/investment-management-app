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
//     totalCost,
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
//           setError(data.error || "Failed to fetch latest price");
//         }
//       } catch (err) {
//         setError("Error fetching latest price");
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
//       <h3 className="text-xl font-bold mb-2">
//         {name} ({ticker})
//       </h3>
//       <p>
//         <strong>Asset Type:</strong> {assetType}
//       </p>
//       {totalQuantity !== undefined ? (
//         // Display aggregated data
//         <>
//           <p>
//             <strong>Total Quantity:</strong> {totalQuantity || 0}
//           </p>
//           <p>
//             <strong>Average Purchase Price:</strong> $
//             {averagePurchasePrice
//               ? averagePurchasePrice.toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })
//               : "0.00"}
//           </p>
//           <p>
//             <strong>Total Cost:</strong> $
//             {totalCost
//               ? totalCost.toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })
//               : "0.00"}
//           </p>
//         </>
//       ) : (
//         // Display individual purchase data
//         <>
//           <p>
//             <strong>Purchase Date:</strong>{" "}
//             {new Date(stock.purchaseDate).toLocaleDateString()}
//           </p>
//           <p>
//             <strong>Quantity:</strong> {quantity}
//           </p>
//           <p>
//             <strong>Purchase Price:</strong> $
//             {purchasePrice.toLocaleString("en-US", {
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2,
//             })}
//           </p>
//           <p>
//             <strong>Brokerage Fees:</strong> $
//             {brokerageFees.toLocaleString("en-US", {
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2,
//             })}
//           </p>
//           <p>
//             <strong>Total Cost:</strong> $
//             {(purchasePrice * quantity + brokerageFees).toLocaleString(
//               "en-US",
//               { minimumFractionDigits: 2, maximumFractionDigits: 2 }
//             )}
//           </p>
//         </>
//       )}
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
    quantity,
    purchasePrice,
    brokerageFees,
    totalQuantity,
    averagePurchasePrice,
    totalCost
  } = stock;

  // State for latest prices
  const [latestPrice, setLatestPrice] = useState({ open: null, close: null });
  const [error, setError] = useState(null);

  // Fetch latest prices from the backend
  useEffect(() => {
    const fetchLatestPrice = async () => {
      try {
        const response = await fetch(`/api/stock/latest/${ticker}`);
        const data = await response.json();

        if (response.ok) {
          setLatestPrice({ open: data.open, close: data.close });
        } else {
          setError(data.error || 'Failed to fetch latest price');
        }
      } catch (err) {
        setError('Error fetching latest price');
        console.error(err);
      }
    };

    if (ticker) {
      fetchLatestPrice();
    }
  }, [ticker]);

  return (
    <div
      className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <h3 className="text-xl font-bold mb-2">{name} ({ticker})</h3>
      <p><strong>Asset Type:</strong> {assetType}</p>

      {totalQuantity !== undefined ? (
        // Display aggregated data
        <>
          <p><strong>Total Quantity:</strong> {totalQuantity || 0}</p>
          <p>
            <strong>Average Purchase Price:</strong> $
            {averagePurchasePrice ? 
              averagePurchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
              "0.00"}
          </p>
          <p>
            <strong>Total Cost:</strong> $
            {totalCost ? 
              totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
              "0.00"}
          </p>
        </>
      ) : (
        // Display individual purchase data
        <>
          <p><strong>Purchase Date:</strong> {new Date(stock.purchaseDate).toLocaleDateString()}</p>
          <p><strong>Quantity:</strong> {quantity}</p>
          <p><strong>Purchase Price:</strong> ${purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p><strong>Brokerage Fees:</strong> ${brokerageFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p><strong>Total Cost:</strong> ${((purchasePrice * quantity) + brokerageFees).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </>
      )}

      {/* Display latest price information */}
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Latest Prices</h4>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p><strong>Open:</strong> {latestPrice.open !== null ? `$${latestPrice.open.toFixed(2)}` : "Loading..."}</p>
            <p><strong>Close:</strong> {latestPrice.close !== null ? `$${latestPrice.close.toFixed(2)}` : "Loading..."}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default StockCard;
