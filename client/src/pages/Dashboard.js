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
//   const [loading, setLoading] = useState(true);  // Loading state
//   const [error, setError] = useState(null);  // Error state

//   useEffect(() => {
//     const fetchAggregatedPortfolio = async () => {
//       try {
//         const response = await axios.get(`/api/portfolio/aggregate/${currentUser.uid}`);
//         setPortfolio(response.data);
//         setLoading(false);  // Set loading to false once data is fetched
//       } catch (error) {
//         setLoading(false);  // Stop loading if there's an error
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
//           {loading ? (
//             <p className="text-center">Loading portfolio data...</p>
//           ) : error ? (
//             <p className="text-center text-red-500">{error}</p>
//           ) : portfolio.length > 0 ? (
//             portfolio.map((stock, index) => (
//               <StockCard key={index} stock={stock} onClick={() => handleCardClick(stock.ticker)} />
//             ))
//           ) : (
//             <p className="text-center text-gray-600">Your portfolio is empty. Start adding stocks to track your investments!</p>
//           )}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Dashboard;

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
//   const [totalWealth, setTotalWealth] = useState(0);
//   const [totalProfitLoss, setTotalProfitLoss] = useState(0);
//   const [totalProfitLossPercent, setTotalProfitLossPercent] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch total wealth and aggregated portfolio data
//   useEffect(() => {
//     const fetchPortfolioAndWealth = async () => {
//       try {
//         setLoading(true);

//         const wealthResponse = await axios.get(`/api/total-wealth/${currentUser.uid}`);
//         const fetchedTotalWealth = wealthResponse.data.totalWealth || 0;
//         setTotalWealth(fetchedTotalWealth);

//         const response = await axios.get(`/api/portfolio/aggregate/${currentUser.uid}`);
//         setPortfolio(response.data);

//         const totalCost = response.data.reduce((sum, stock) => sum + stock.totalCost, 0);
//         const profitLoss = fetchedTotalWealth - totalCost;
//         const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

//         setTotalProfitLoss(profitLoss);
//         setTotalProfitLossPercent(profitLossPercent);

//         // Fetch updated total wealth
//         await axios.post(`/api/total-wealth/update`, { userId: currentUser.uid });

//         setLoading(false);
//       } catch (err) {
//         setLoading(false);
//         setError("Failed to fetch portfolio data.");
//         console.error("Error fetching portfolio data:", err);
//       }
//     };

//     if (currentUser) {
//       fetchPortfolioAndWealth();
//     }
//   }, [currentUser]);

//   // useEffect(() => {
//   //   const fetchPortfolioAndWealth = async () => {
//   //     try {
//   //       setLoading(true);

//   //       // Fetch total wealth
//   //       const wealthResponse = await axios.get(`/api/total-wealth/${currentUser.uid}`);
//   //       const fetchedTotalWealth = wealthResponse.data.totalWealth || 0;
//   //       setTotalWealth(fetchedTotalWealth);

//   //       // Fetch aggregated portfolio
//   //       const response = await axios.get(`/api/portfolio/aggregate/${currentUser.uid}`);
//   //       setPortfolio(response.data);

//   //       // Calculate total cost of the portfolio
//   //       const totalCost = response.data.reduce((sum, stock) => sum + stock.totalCost, 0);

//   //       // Calculate profit/loss and profit/loss percentage
//   //       const profitLoss = fetchedTotalWealth - totalCost;
//   //       const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

//   //       setTotalProfitLoss(profitLoss);
//   //       setTotalProfitLossPercent(profitLossPercent);

//   //       setLoading(false);
//   //     } catch (err) {
//   //       setLoading(false);
//   //       if (err.response && err.response.status === 404) {
//   //         setError("No portfolio data found.");
//   //       } else {
//   //         console.error("Error fetching portfolio data:", err);
//   //         setError("Failed to fetch portfolio data.");
//   //       }
//   //     }
//   //   };

//   //   if (currentUser) {
//   //     fetchPortfolioAndWealth();
//   //   }
//   // }, [currentUser]);

//   const handleCardClick = (ticker) => {
//     navigate(`/stock-details/${ticker}`);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Header setPortfolio={setPortfolio} />
//       <main className="flex flex-col items-start justify-start flex-grow p-4">
//         {loading ? (
//           <p className="text-center">Loading portfolio data...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : (
//           <>
//             <div className="mb-4">
//               <h2 className="text-2xl font-bold">Portfolio Overview</h2>
//               <p>
//                 <strong>Total Wealth:</strong> ${totalWealth.toLocaleString("en-US", { minimumFractionDigits: 2 })}
//               </p>
//               <p className={totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}>
//                 <strong>Total Profit/Loss:</strong> ${totalProfitLoss.toLocaleString("en-US", { minimumFractionDigits: 2 })}
//                 ({totalProfitLossPercent.toFixed(2)}%)
//               </p>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
//               {portfolio.length > 0 ? (
//                 portfolio.map((stock, index) => (
//                   <StockCard key={index} stock={stock} onClick={() => handleCardClick(stock.ticker)} />
//                 ))
//               ) : (
//                 <p className="text-center text-gray-600">Your portfolio is empty. Start adding stocks to track your investments!</p>
//               )}
//             </div>
//           </>
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Dashboard;

// import { useEffect, useState } from "react";
// import { useAuth } from "../context/UserContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import StockCard from "../components/StockCard";
// import PortfolioPieChart from "../components/PortfolioPieChart";
// import WealthAreaChart from "../components/WealthAreaChart";

// const Dashboard = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [portfolio, setPortfolio] = useState([]);
//   const [totalWealth, setTotalWealth] = useState(0);
//   const [totalInvested, setTotalInvested] = useState(0); // New state for total invested
//   const [totalProfitLoss, setTotalProfitLoss] = useState(0);
//   const [totalProfitLossPercent, setTotalProfitLossPercent] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch total wealth, total invested, and aggregated portfolio data
//   useEffect(() => {
//     const fetchPortfolioAndWealth = async () => {
//       try {
//         setLoading(true);

//         // Fetch total wealth and total invested
//         let fetchedTotalWealth = 0;
//         let fetchedTotalInvested = 0;
//         try {
//           const wealthResponse = await axios.get(
//             `/api/total-wealth/${currentUser.uid}`
//           );
//           fetchedTotalWealth = wealthResponse.data.totalWealth || 0;
//           fetchedTotalInvested = wealthResponse.data.totalInvested || 0;
//         } catch (error) {
//           if (error.response && error.response.status === 404) {
//             console.log(
//               "No total wealth data found for new user. Initializing to 0."
//             );
//           } else {
//             console.error("Error fetching total wealth:", error);
//           }
//         }

//         setTotalWealth(fetchedTotalWealth);
//         setTotalInvested(fetchedTotalInvested);

//         // Fetch aggregated portfolio
//         const response = await axios.get(
//           `/api/portfolio/aggregate/${currentUser.uid}`
//         );
//         setPortfolio(response.data);

//         // Calculate profit/loss
//         const totalCost = response.data.reduce(
//           (sum, stock) => sum + stock.totalCost,
//           0
//         );
//         const profitLoss = fetchedTotalWealth - totalCost;
//         const profitLossPercent =
//           totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

//         setTotalProfitLoss(profitLoss);
//         setTotalProfitLossPercent(profitLossPercent);

//         // Update total wealth
//         await axios.post(`/api/total-wealth/update`, {
//           userId: currentUser.uid,
//         });

//         setLoading(false);
//       } catch (err) {
//         setLoading(false);
//         setError("Failed to fetch portfolio data.");
//         console.error("Error fetching portfolio data:", err);
//       }
//     };

//     if (currentUser) {
//       fetchPortfolioAndWealth();
//     }
//   }, [currentUser]);

//   // useEffect(() => {
//   //   const fetchPortfolioAndWealth = async () => {
//   //     try {
//   //       setLoading(true);

//   //       // Fetch total wealth and total invested
//   //       const wealthResponse = await axios.get(`/api/total-wealth/${currentUser.uid}`);
//   //       const fetchedTotalWealth = wealthResponse.data.totalWealth || 0;
//   //       const fetchedTotalInvested = wealthResponse.data.totalInvested || 0;
//   //       setTotalWealth(fetchedTotalWealth);
//   //       setTotalInvested(fetchedTotalInvested);

//   //       // Fetch aggregated portfolio
//   //       const response = await axios.get(`/api/portfolio/aggregate/${currentUser.uid}`);
//   //       setPortfolio(response.data);

//   //       // Calculate profit/loss and profit/loss percentage
//   //       const totalCost = response.data.reduce((sum, stock) => sum + stock.totalCost, 0);
//   //       const profitLoss = fetchedTotalWealth - totalCost;
//   //       const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

//   //       setTotalProfitLoss(profitLoss);
//   //       setTotalProfitLossPercent(profitLossPercent);

//   //       // Fetch updated total wealth and total invested
//   //       await axios.post(`/api/total-wealth/update`, { userId: currentUser.uid });

//   //       setLoading(false);
//   //     } catch (err) {
//   //       setLoading(false);
//   //       setError("Failed to fetch portfolio data.");
//   //       console.error("Error fetching portfolio data:", err);
//   //     }
//   //   };

//   //   if (currentUser) {
//   //     fetchPortfolioAndWealth();
//   //   }
//   // }, [currentUser]);

//   const handleCardClick = (ticker) => {
//     navigate(`/stock-details/${ticker}`);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Header setPortfolio={setPortfolio} />
//       <main className="flex flex-col items-start justify-start flex-grow p-4">
//         {loading ? (
//           <p className="text-center">Loading portfolio data...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : (
//           <>
//             <div className="mb-4">
//               <h2 className="text-2xl font-bold">Portfolio Overview</h2>
//               <p>
//                 <strong>Total Wealth:</strong> $
//                 {totalWealth.toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                 })}
//               </p>
//               <p>
//                 <strong>Total Invested:</strong> $
//                 {totalInvested.toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                 })}
//               </p>
//               <p
//                 className={
//                   totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
//                 }
//               >
//                 <strong>Total Profit/Loss:</strong> $
//                 {totalProfitLoss.toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                 })}
//                 ({totalProfitLossPercent.toFixed(2)}%)
//               </p>
//             </div>

//             {/* Charts Section */}
//             {/* <div className="chart-container flex justify-left items-center w-full lg:w-1/2 h-80 mb-8">
//               <PortfolioPieChart portfolio={portfolio} />
//             </div> */}
//             <div className="flex flex-wrap w-full lg:w-full gap-4 mb-8">
//               <div className="w-full lg:w-1/2 h-80">
//                 <PortfolioPieChart portfolio={portfolio} />
//               </div>
//               <div className="w-full lg:w-1/2 h-80">
//                 <WealthAreaChart
//                   totalWealth={totalWealth}
//                   totalInvested={totalInvested}
//                 />
//               </div>
//             </div>

//             {/* Stock Cards Section */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
//               {portfolio.length > 0 ? (
//                 portfolio.map((stock, index) => (
//                   <StockCard
//                     key={index}
//                     stock={stock}
//                     onClick={() => handleCardClick(stock.ticker)}
//                   />
//                 ))
//               ) : (
//                 <p className="text-center text-gray-600">
//                   Your portfolio is empty. Start adding stocks to track your
//                   investments!
//                 </p>
//               )}
//             </div>
//           </>
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Dashboard;

// import { useEffect, useState } from "react";
// import { useAuth } from "../context/UserContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import StockCard from "../components/StockCard";
// import PortfolioPieChart from "../components/PortfolioPieChart";
// import WealthAreaChart from "../components/WealthAreaChart";

// const Dashboard = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [portfolio, setPortfolio] = useState([]);
//   const [totalWealth, setTotalWealth] = useState(0);
//   const [totalInvested, setTotalInvested] = useState(0); // New state for total invested
//   const [totalProfitLoss, setTotalProfitLoss] = useState(0);
//   const [totalProfitLossPercent, setTotalProfitLossPercent] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPortfolioAndWealth = async () => {
//       try {
//         setLoading(true);
  
//         // Fetch updated total wealth and total invested
//         const wealthResponse = await axios.post(`/api/total-wealth/update`, {
//           userId: currentUser.uid,
//         });
//         const fetchedTotalWealth = wealthResponse.data.totalWealth || 0;
//         const fetchedTotalInvested = wealthResponse.data.totalInvested || 0;
  
//         setTotalWealth(fetchedTotalWealth);
//         setTotalInvested(fetchedTotalInvested);
  
//         // Fetch aggregated portfolio
//         const response = await axios.get(`/api/portfolio/aggregate/${currentUser.uid}`);
//         setPortfolio(response.data);
  
//         // Calculate total profit/loss
//         const totalCost = response.data.reduce((sum, stock) => sum + stock.totalCost, 0);
//         const profitLoss = fetchedTotalWealth - totalCost;
//         const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;
  
//         setTotalProfitLoss(profitLoss);
//         setTotalProfitLossPercent(profitLossPercent);
  
//         setLoading(false);
//       } catch (err) {
//         setLoading(false);
//         setError("Failed to fetch portfolio data.");
//         console.error("Error fetching portfolio data:", err);
//       }
//     };
  
//     if (currentUser) {
//       fetchPortfolioAndWealth();
//     }
//   }, [currentUser]);

 

//   const handleCardClick = (ticker) => {
//     navigate(`/stock-details/${ticker}`);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Header setPortfolio={setPortfolio} />
//       <main className="flex flex-col items-start justify-start flex-grow p-4">
//         {loading ? (
//           <p className="text-center">Loading portfolio data...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : (
//           <>
//             <div className="mb-4">
//               <h2 className="text-2xl font-bold">Portfolio Overview</h2>
//               <p>
//                 <strong>Total Wealth:</strong> $
//                 {totalWealth.toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                 })}
//               </p>
//               <p>
//                 <strong>Total Invested:</strong> $
//                 {totalInvested.toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                 })}
//               </p>
//               <p
//                 className={
//                   totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
//                 }
//               >
//                 <strong>Total Profit/Loss:</strong> $
//                 {totalProfitLoss.toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                 })}
//                 ({totalProfitLossPercent.toFixed(2)}%)
//               </p>
//             </div>

//             {/* Container for Charts */}
//             <div className="flex flex-row justify-around items-start w-full mb-8">
//               {/* Pie Chart Container */}
//               <div className="flex justify-center items-center w-2/5 h-80">
//                 <PortfolioPieChart portfolio={portfolio} />
//               </div>

//               {/* Area Chart Container */}
//               <div className="flex justify-center items-center w-3/5 h-80">
//                 <WealthAreaChart />
//               </div>
//             </div>

//             {/* Stock Cards Section */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
//               {portfolio.length > 0 ? (
//                 portfolio.map((stock, index) => (
//                   <StockCard
//                     key={index}
//                     stock={stock}
//                     onClick={() => handleCardClick(stock.ticker)}
//                   />
//                 ))
//               ) : (
//                 <p className="text-center text-gray-600">
//                   Your portfolio is empty. Start adding stocks to track your
//                   investments!
//                 </p>
//               )}
//             </div>
//           </>
//         )}
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
import PortfolioPieChart from "../components/PortfolioPieChart";
import WealthAreaChart from "../components/WealthAreaChart";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]);
  const [totalWealth, setTotalWealth] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [totalProfitLossPercent, setTotalProfitLossPercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioAndWealth = async () => {
      try {
        setLoading(true);

        // Fetch updated total wealth and total invested
        const wealthResponse = await axios.post(`/api/total-wealth/update`, {
          userId: currentUser.uid,
        });
        const fetchedTotalWealth = wealthResponse.data.totalWealth || 0;
        const fetchedTotalInvested = wealthResponse.data.totalInvested || 0;

        setTotalWealth(fetchedTotalWealth);
        setTotalInvested(fetchedTotalInvested);

        // Fetch aggregated portfolio
        const response = await axios.get(`/api/portfolio/aggregate/${currentUser.uid}`);
        const aggregatedPortfolio = response.data;

        // Fetch latest price for each stock in the portfolio
        const updatedPortfolio = await Promise.all(
          aggregatedPortfolio.map(async (stock) => {
            const { ticker } = stock;
            try {
              const priceResponse = await axios.post(`/api/stock/latest/${ticker}`);
              const currentPrice = priceResponse.data?.close || 0;
              const totalValue = currentPrice * stock.totalQuantity;
              return {
                ...stock,
                currentPrice,
                totalValue,
              };
            } catch (error) {
              console.error(`Error fetching price for ${ticker}:`, error);
              return { ...stock, currentPrice: 0, totalValue: 0 };
            }
          })
        );

        setPortfolio(updatedPortfolio);

        // Calculate total profit/loss
        const totalCost = updatedPortfolio.reduce((sum, stock) => sum + stock.totalCost, 0);
        const profitLoss = fetchedTotalWealth - totalCost;
        const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

        setTotalProfitLoss(profitLoss);
        setTotalProfitLossPercent(profitLossPercent);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Failed to fetch portfolio data.");
        console.error("Error fetching portfolio data:", err);
      }
    };

    if (currentUser) {
      fetchPortfolioAndWealth();
    }
  }, [currentUser]);

  const handleCardClick = (ticker) => {
    navigate(`/stock-details/${ticker}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header setPortfolio={setPortfolio} />
      <main className="flex flex-col items-start justify-start flex-grow p-4">
        {loading ? (
          <p className="text-center">Loading portfolio data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Portfolio Overview</h2>
              <p>
                <strong>Total Wealth:</strong> $
                {totalWealth.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p>
                <strong>Total Invested:</strong> $
                {totalInvested.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p
                className={
                  totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                <strong>Total Profit/Loss:</strong> $
                {totalProfitLoss.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
                ({totalProfitLossPercent.toFixed(2)}%)
              </p>
            </div>

            {/* Container for Charts */}
            <div className="flex flex-row justify-around items-start w-full mb-8">
              {/* Pie Chart Container */}
              <div className="flex justify-center items-center w-2/5 h-80">
                <PortfolioPieChart portfolio={portfolio} />
              </div>

              {/* Area Chart Container */}
              <div className="flex justify-center items-center w-3/5 h-80">
                <WealthAreaChart />
              </div>
            </div>

            {/* Stock Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {portfolio.length > 0 ? (
                portfolio.map((stock, index) => (
                  <StockCard
                    key={index}
                    stock={stock}
                    onClick={() => handleCardClick(stock.ticker)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-600">
                  Your portfolio is empty. Start adding stocks to track your
                  investments!
                </p>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
