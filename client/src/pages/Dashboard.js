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

//   useEffect(() => {
//     const fetchPortfolio = async () => {
//       try {
//         const response = await axios.get(`/api/portfolio/${currentUser.uid}`);
//         setPortfolio(response.data);
//       } catch (error) {
//         console.error('Error fetching portfolio:', error);
//       }
//     };

//     if (currentUser) {
//       fetchPortfolio();
//     }
//   }, [currentUser]);

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Header setPortfolio={setPortfolio} />
//       <main className="flex flex-col items-start justify-start flex-grow p-4">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
//           {portfolio.length > 0 ? (
//             portfolio.map((stock, index) => (
//               <StockCard key={index} stock={stock} />
//             ))
//           ) : (
//             <p className="text-center">No stocks in portfolio</p>
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

  useEffect(() => {
    const fetchAggregatedPortfolio = async () => {
      try {
        const response = await axios.get(`/api/portfolio/aggregate/${currentUser.uid}`);
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching aggregated portfolio:", error);
      }
    };

    if (currentUser) {
      fetchAggregatedPortfolio();
    }
  }, [currentUser]);

  // Handler for navigating to the detailed view
  const handleCardClick = (ticker) => {
    navigate(`/stock-details/${ticker}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header setPortfolio={setPortfolio} />
      <main className="flex flex-col items-start justify-start flex-grow p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {portfolio.length > 0 ? (
            portfolio.map((stock, index) => (
              <StockCard key={index} stock={stock} onClick={() => handleCardClick(stock.ticker)} />
            ))
          ) : (
            <p className="text-center">No stocks in portfolio</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
