// import { useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/UserContext";

// const SearchStock = ({ setPortfolio }) => {
//   const [query, setQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [hoveredItem, setHoveredItem] = useState(null);
//   const { currentUser } = useAuth();

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(`/api/search/${query}`);
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//     }
//   };

//   const addToPortfolio = async (stock) => {
//     try {
//         const response = await axios.post('/api/portfolio/add', {
//             userId: currentUser.uid,
//             stock: {
//                 ticker: stock.ticker,
//                 name: stock.name,
//                 assetType: stock.assetType
//             }
//         });

//         // Fetch the updated portfolio
//         const portfolioResponse = await axios.get(`/api/portfolio/${currentUser.uid}`);
//         setPortfolio(portfolioResponse.data);
//         console.log(response.data.message);
//     } catch (error) {
//         console.error('Error adding to portfolio:', error);
//     }
// };

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
//         <div className="mt-4 max-h-64 overflow-y-auto pr-2">
//           <h3 className="text-lg font-semibold mb-2">Search Results</h3>
//           <ul className="space-y-2">
//             {searchResults.map((result) => (
//               <li
//                 key={result.ticker}
//                 className="border-b py-2 relative bg-gray-100 hover:bg-gray-200 transition duration-300 rounded-md px-3"
//                 onMouseEnter={() => setHoveredItem(result.ticker)}
//                 onMouseLeave={() => setHoveredItem(null)}
//               >
//                 <p><strong>Symbol:</strong> {result.ticker}</p>
//                 <p><strong>Name:</strong> {result.name}</p>
//                 <p><strong>Asset Type:</strong> {result.assetType}</p>
//                 {hoveredItem === result.ticker && (
//                   <button
//                     onClick={() => addToPortfolio(result)}
//                     className="absolute right-2 top-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-300"
//                   >
//                     Add to Portfolio
//                   </button>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchStock;




import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/UserContext";

const SearchStock = ({ setPortfolio }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { currentUser } = useAuth();
  const searchRef = useRef(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/search/${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const addToPortfolio = async (stock) => {
    try {
      await axios.post("/api/portfolio/add", {
        userId: currentUser.uid,
        stock: {
          ticker: stock.ticker,
          name: stock.name,
          assetType: stock.assetType,
        },
      });
      const portfolioResponse = await axios.get(`/api/portfolio/${currentUser.uid}`);
      setPortfolio(portfolioResponse.data);
      setSearchResults([]);
    } catch (error) {
      console.error("Error adding to portfolio:", error);
    }
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setQuery("");
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative">
      <div className="flex border rounded w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Stocks"
          className="p-2 w-full rounded-l border-0 focus:ring-0"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded shadow max-h-60 overflow-y-auto z-10">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-200 flex justify-between items-center"
              onMouseEnter={() => setHoveredItem(result.ticker)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div>
                <p>
                  <strong>{result.ticker}</strong> - {result.name}
                </p>
                <p>{result.assetType}</p>
              </div>
              {hoveredItem === result.ticker && (
                <button
                  onClick={() => addToPortfolio(result)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchStock;

