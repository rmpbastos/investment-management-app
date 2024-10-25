import React from "react";

const StockCard = ({ stock }) => {
  return (
    <div className="bg-white shadow-md rounded p-4">
      <h3 className="text-xl font-bold mb-2">{stock.name} ({stock.ticker})</h3>
      <p><strong>Asset Type:</strong> {stock.assetType}</p>
      <p><strong>Purchase Date:</strong> {new Date(stock.purchaseDate).toLocaleDateString()}</p>
      <p><strong>Quantity:</strong> {stock.quantity}</p>
      <p><strong>Purchase Price:</strong> ${stock.purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>Brokerage Fees:</strong> ${stock.brokerageFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>Total Cost:</strong> ${(stock.purchasePrice * stock.quantity + stock.brokerageFees).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
  );
};

export default StockCard;



