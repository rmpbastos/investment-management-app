// import { useEffect, useState } from "react";
// import { useAuth } from "../context/UserContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import StockCard from "../components/StockCard";

// const Dashboard = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [portfolio, setPortfolio] = useState([]);
//   const [error, setError] = useState(null);  // Add error state

//   useEffect(() => {
//     const fetchAggregatedPortfolio = async () => {
//       try {
//         const response = await axios.get(`/api/portfolio/aggregate/${currentUser.uid}`);
//         setPortfolio(response.data);
//       } catch (error) {
//         if (error.response && error.response.status === 404) {
//           setError('No portfolio data found.');  // Handle 404 error
//         } else {
//           console.error("Error fetching aggregated portfolio:", error);
//           setError('Failed to fetch portfolio data.');
//         }
//       }
//     };

//     if (currentUser) {
//       fetchAggregatedPortfolio();
//     }
//   }, [currentUser]);

//   const handleCardClick = (ticker) => {
//     navigate(`/stock-details/${ticker}`);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Header setPortfolio={setPortfolio} />
//       <main className="flex flex-col items-start justify-start flex-grow p-4">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
//           {error ? (
//             <p className="text-center text-red-500">{error}</p>  // Display error message
//           ) : portfolio.length > 0 ? (
//             portfolio.map((stock, index) => (
//               <StockCard key={index} stock={stock} onClick={() => handleCardClick(stock.ticker)} />
//             ))
//           ) : (
//             <p className="text-center">Loading portfolio data...</p>
//           )}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Dashboard;




import { useEffect, useState } from "react";
import { useAuth } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StockCard from "../components/StockCard";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  useEffect(() => {
    const fetchAggregatedPortfolio = async () => {
      try {
        const response = await axios.get(`/api/portfolio/aggregate/${currentUser.uid}`);
        setPortfolio(response.data);
        setLoading(false);  // Set loading to false once data is fetched
      } catch (error) {
        setLoading(false);  // Stop loading if there's an error
        if (error.response && error.response.status === 404) {
          setError('No portfolio data found.');  // Handle 404 error
        } else {
          console.error("Error fetching aggregated portfolio:", error);
          setError('Failed to fetch portfolio data.');
        }
      }
    };

    if (currentUser) {
      fetchAggregatedPortfolio();
    }
  }, [currentUser]);

  const handleCardClick = (ticker) => {
    navigate(`/stock-details/${ticker}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header setPortfolio={setPortfolio} />
      <main className="flex flex-col items-start justify-start flex-grow p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {loading ? (
            <p className="text-center">Loading portfolio data...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : portfolio.length > 0 ? (
            portfolio.map((stock, index) => (
              <StockCard key={index} stock={stock} onClick={() => handleCardClick(stock.ticker)} />
            ))
          ) : (
            <p className="text-center text-gray-600">Your portfolio is empty. Start adding stocks to track your investments!</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
