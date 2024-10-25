// import React from "react";

// const StockCard = ({ stock }) => {
//   return (
//     <div className="bg-white shadow-md rounded p-4">
//       <h3 className="text-xl font-bold mb-2">{stock.name} ({stock.ticker})</h3>
//       <p><strong>Asset Type:</strong> {stock.assetType}</p>
//       <p><strong>Purchase Date:</strong> {new Date(stock.purchaseDate).toLocaleDateString()}</p>
//       <p><strong>Quantity:</strong> {stock.quantity}</p>
//       <p><strong>Purchase Price:</strong> ${stock.purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//       <p><strong>Brokerage Fees:</strong> ${stock.brokerageFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//       <p><strong>Total Cost:</strong> ${(stock.purchasePrice * stock.quantity + stock.brokerageFees).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//     </div>
//   );
// };

// export default StockCard;






// import React from "react";

// const StockCard = ({ stock, onClick }) => {
//   // Destructure stock properties
//   const {
//     name,
//     ticker,
//     assetType,
//     totalQuantity,
//     averagePurchasePrice,
//     totalCost
//   } = stock;

//   return (
//     <div
//       className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg transition-shadow"
//       onClick={onClick}
//     >
//       <h3 className="text-xl font-bold mb-2">{name} ({ticker})</h3>
//       <p><strong>Asset Type:</strong> {assetType}</p>
//       <p><strong>Total Quantity:</strong> {totalQuantity || 0}</p>
//       <p>
//         <strong>Average Purchase Price:</strong> $
//         {averagePurchasePrice ? 
//           averagePurchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
//           "0.00"}
//       </p>
//       <p>
//         <strong>Total Cost:</strong> $
//         {totalCost ? 
//           totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
//           "0.00"}
//       </p>
//     </div>
//   );
// };

// export default StockCard;




import React from "react";

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
    </div>
  );
};

export default StockCard;
