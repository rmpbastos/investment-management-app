import React, { useState } from 'react';
import axios from 'axios';

const SearchStock = () => {
    const [ticker, setTicker] = useState('');
    const [stockMetaData, setStockMetaData] = useState(null);
    const [error, setError] = useState(null);

    // Handle form submission and stock search
    const handleSearch = async (e) => {
        e.preventDefault();
        setError(null); // Reset error message

        try {
            const response = await axios.get(`/api/stock/${ticker}`);
            setStockMetaData(response.data); // Save the stock meta data
            setError(null)
        } catch (error) {
            setError('Error fetching stock data. Please try again.');
            setStockMetaData(null);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Search for Stock</h2>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="Enter stock ticker"
              className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Search
            </button>
          </form>
    
          {error && <p className="text-red-500 mt-4">{error}</p>}
    
          {stockMetaData && (
            <div className="mt-6">
              <h3 className="text-xl font-bold">Stock Information</h3>
              <p><strong>Symbol:</strong> {stockMetaData.ticker}</p>
              <p><strong>Name:</strong> {stockMetaData.name}</p>
              <p><strong>Exchange:</strong> {stockMetaData.exchangeCode}</p>
            </div>
          )}
        </div>
      );


 };

 export default SearchStock;