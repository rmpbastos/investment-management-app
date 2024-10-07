// import { useState } from "react";
// import axios from "axios";

// const SearchStock = () => {
//   const [query, setQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(`/api/search/${query}`);
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full overflow-hidden">
//       <h2 className="text-xl font-bold mb-4 text-center">Search for Stock</h2>
//       <input 
//         type="text" 
//         value={query} 
//         onChange={(e) => setQuery(e.target.value)} 
//         placeholder="Enter stock symbol or name" 
//         className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       <button 
//         onClick={handleSearch} 
//         className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
//       >
//         Search
//       </button>

//       {searchResults.length > 0 && (
//         <div className="mt-4 max-h-64 overflow-y-auto pr-2 bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-lg font-semibold mb-2">Search Results</h3>
//           <ul className="space-y-2">
//             {searchResults.map((result) => (
//               <li key={result.ticker} className="border-b py-2 hover:bg-gray-200 transition duration-200 rounded-md p-2">
//                 <p><strong>Symbol:</strong> {result.ticker}</p>
//                 <p><strong>Name:</strong> {result.name}</p>
//                 <p><strong>Asset Type:</strong> {result.assetType}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchStock;



import { useState } from "react";
import axios from "axios";

const SearchStock = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/search/${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const addToPortfolio = (stock) => {
    console.log(`Adding ${stock.name} to portfolio`);
    // Implement your logic here
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full overflow-hidden">
      <h2 className="text-xl font-bold mb-4 text-center">Search for Stock</h2>
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Enter stock symbol or name" 
        className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        onClick={handleSearch} 
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Search
      </button>

      {searchResults.length > 0 && (
        <div className="mt-4 max-h-64 overflow-y-auto pr-2">
          <h3 className="text-lg font-semibold mb-2">Search Results</h3>
          <ul className="space-y-2">
            {searchResults.map((result) => (
              <li 
                key={result.ticker} 
                className="border-b py-2 relative bg-gray-100 hover:bg-gray-200 transition duration-300 rounded-md px-3"
                onMouseEnter={() => setHoveredItem(result.ticker)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <p><strong>Symbol:</strong> {result.ticker}</p>
                <p><strong>Name:</strong> {result.name}</p>
                <p><strong>Asset Type:</strong> {result.assetType}</p>
                {hoveredItem === result.ticker && (
                  <button 
                    onClick={() => addToPortfolio(result)}
                    className="absolute right-2 top-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    Add to Portfolio
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchStock;
