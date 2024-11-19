// Working
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
//   const [totalInvested, setTotalInvested] = useState(0);
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
//         const aggregatedPortfolio = response.data;

//         // Fetch latest price for each stock in the portfolio
//         const updatedPortfolio = await Promise.all(
//           aggregatedPortfolio.map(async (stock) => {
//             const { ticker } = stock;
//             try {
//               const priceResponse = await axios.post(`/api/stock/latest/${ticker}`);
//               const currentPrice = priceResponse.data?.close || 0;
//               const totalValue = currentPrice * stock.totalQuantity;
//               return {
//                 ...stock,
//                 currentPrice,
//                 totalValue,
//               };
//             } catch (error) {
//               console.error(`Error fetching price for ${ticker}:`, error);
//               return { ...stock, currentPrice: 0, totalValue: 0 };
//             }
//           })
//         );

//         setPortfolio(updatedPortfolio);

//         // Calculate total profit/loss
//         const totalCost = updatedPortfolio.reduce((sum, stock) => sum + stock.totalCost, 0);
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
//                 <WealthAreaChart userId={currentUser.uid} />
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

// This code is making multiple fetches to portfolio and wealth
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
//   const [totalInvested, setTotalInvested] = useState(0);
//   const [totalProfitLoss, setTotalProfitLoss] = useState(0);
//   const [totalProfitLossPercent, setTotalProfitLossPercent] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPortfolioAndWealth = async () => {
//       try {
//         setLoading(true);

//         const wealthResponse = await axios.post(`/api/total-wealth/update`, {
//           userId: currentUser.uid,
//         });
//         const fetchedTotalWealth = wealthResponse.data.totalWealth || 0;
//         const fetchedTotalInvested = wealthResponse.data.totalInvested || 0;

//         setTotalWealth(fetchedTotalWealth);
//         setTotalInvested(fetchedTotalInvested);

//         const response = await axios.get(`/api/portfolio/aggregate/${currentUser.uid}`);
//         const aggregatedPortfolio = response.data;

//         const updatedPortfolio = await Promise.all(
//           aggregatedPortfolio.map(async (stock) => {
//             const { ticker } = stock;
//             try {
//               const priceResponse = await axios.post(`/api/stock/latest/${ticker}`);
//               const currentPrice = priceResponse.data?.close || 0;
//               const totalValue = currentPrice * stock.totalQuantity;
//               return {
//                 ...stock,
//                 currentPrice,
//                 totalValue,
//               };
//             } catch (error) {
//               console.error(`Error fetching price for ${ticker}:`, error);
//               return { ...stock, currentPrice: 0, totalValue: 0 };
//             }
//           })
//         );

//         setPortfolio(updatedPortfolio);

//         const totalCost = updatedPortfolio.reduce((sum, stock) => sum + stock.totalCost, 0);
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
//   <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>

//   {loading ? (
//     <p className="text-center">Loading portfolio data...</p>
//   ) : error ? (
//     <p className="text-center text-red-500">{error}</p>
//   ) : (
//     <>
//       {/* Overview Section with Card Styles */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"> {/* Increased bottom margin */}
//         <div className="bg-white shadow-md rounded-lg p-4 text-center">
//           <h3 className="text-lg font-bold">Total Wealth</h3>
//           <p className="text-2xl font-semibold">
//             ${totalWealth.toLocaleString("en-US", { minimumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-4 text-center">
//           <h3 className="text-lg font-bold">Total Invested</h3>
//           <p className="text-2xl font-semibold">
//             ${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-4 text-center">
//           <h3 className="text-lg font-bold">Profit</h3>
//           <p
//             className={`text-2xl font-semibold ${
//               totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             ${totalProfitLoss.toLocaleString("en-US", { minimumFractionDigits: 2 })} (
//             {totalProfitLossPercent.toFixed(2)}%)
//           </p>
//         </div>
//       </div>

//       {/* Charts Section with Increased Spacing */}
//       <div className="flex flex-row justify-between items-start w-full mb-10 mt-10 gap-6"> {/* Added gap and adjusted right margin */}
//         <div className="flex justify-center items-center w-1/2 h-80">
//           <PortfolioPieChart portfolio={portfolio} />
//         </div>
//         <div className="flex justify-center items-center w-1/2 h-80" style={{ marginRight: '10rem' }}> {/* Added right margin */}
//           <WealthAreaChart userId={currentUser.uid} />
//         </div>
//       </div>

//       {/* Stock Cards Section with Extra Bottom Margin */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mb-12"> {/* Increased bottom margin */}
//         {portfolio.length > 0 ? (
//           portfolio.map((stock, index) => (
//             <StockCard
//               key={index}
//               stock={stock}
//               onClick={() => handleCardClick(stock.ticker)}
//             />
//           ))
//         ) : (
//           <p className="text-center text-gray-600">
//             Your portfolio is empty. Start adding stocks to track your investments!
//           </p>
//         )}
//       </div>
//     </>
//   )}
// </main>

//       <Footer />
//     </div>
//   );
// };

// export default Dashboard;

// import { useEffect, useState } from "react";
// import { useAuth } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import StockCard from "../components/StockCard";
// import PortfolioPieChart from "../components/PortfolioPieChart";
// import WealthAreaChart from "../components/WealthAreaChart";

// const Dashboard = () => {
//   const { currentUser, fetchPortfolioAndWealth } = useAuth();
//   const navigate = useNavigate();
//   const [portfolio, setPortfolio] = useState([]);
//   const [totalWealth, setTotalWealth] = useState(0);
//   const [totalInvested, setTotalInvested] = useState(0);
//   const [totalProfitLoss, setTotalProfitLoss] = useState(0);
//   const [totalProfitLossPercent, setTotalProfitLossPercent] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Use the centralized fetch function from UserContext
//         const { portfolioData, totalWealth, totalInvested } = await fetchPortfolioAndWealth();

//         setTotalWealth(totalWealth);
//         setTotalInvested(totalInvested);

//         // Calculate updated portfolio with current prices
//         const updatedPortfolio = await Promise.all(
//           portfolioData.map(async (stock) => {
//             const { ticker, totalQuantity, totalCost } = stock;
//             const currentPrice = stock.currentPrice || 0;
//             const totalValue = currentPrice * totalQuantity;
//             return {
//               ...stock,
//               currentPrice,
//               totalValue,
//             };
//           })
//         );

//         setPortfolio(updatedPortfolio);

//         // Calculate total profit/loss
//         const totalCost = updatedPortfolio.reduce((sum, stock) => sum + stock.totalCost, 0);
//         const profitLoss = totalWealth - totalCost;
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
//       fetchData();
//     }
//   }, [currentUser, fetchPortfolioAndWealth]);

//   const handleCardClick = (ticker) => {
//     navigate(`/stock-details/${ticker}`);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Header setPortfolio={setPortfolio} />
//       <main className="flex flex-col items-start justify-start flex-grow p-4">
//         <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>

//         {loading ? (
//           <p className="text-center">Loading portfolio data...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : (
//           <>
//             {/* Overview Section with Card Styles */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//               <div className="bg-white shadow-md rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-bold">Total Wealth</h3>
//                 <p className="text-2xl font-semibold">
//                   ${totalWealth.toLocaleString("en-US", { minimumFractionDigits: 2 })}
//                 </p>
//               </div>
//               <div className="bg-white shadow-md rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-bold">Total Invested</h3>
//                 <p className="text-2xl font-semibold">
//                   ${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2 })}
//                 </p>
//               </div>
//               <div className="bg-white shadow-md rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-bold">Profit</h3>
//                 <p
//                   className={`text-2xl font-semibold ${
//                     totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   ${totalProfitLoss.toLocaleString("en-US", { minimumFractionDigits: 2 })} (
//                   {totalProfitLossPercent.toFixed(2)}%)
//                 </p>
//               </div>
//             </div>

//             {/* Charts Section with Increased Spacing */}
//             <div className="flex flex-row justify-between items-start w-full mb-10 mt-10 gap-6">
//               <div className="flex justify-center items-center w-1/2 h-80">
//                 <PortfolioPieChart portfolio={portfolio} />
//               </div>
//               <div className="flex justify-center items-center w-1/2 h-80" style={{ marginRight: "10rem" }}>
//                 <WealthAreaChart userId={currentUser.uid} />
//               </div>
//             </div>

//             {/* Stock Cards Section with Extra Bottom Margin */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mb-12">
//               {portfolio.length > 0 ? (
//                 portfolio.map((stock, index) => (
//                   <StockCard key={index} stock={stock} onClick={() => handleCardClick(stock.ticker)} />
//                 ))
//               ) : (
//                 <p className="text-center text-gray-600">
//                   Your portfolio is empty. Start adding stocks to track your investments!
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

// Apparently working, with caching from UserContext
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
//   const { currentUser, fetchStockData } = useAuth();
//   const navigate = useNavigate();
//   const [portfolio, setPortfolio] = useState([]);
//   const [totalWealth, setTotalWealth] = useState(0);
//   const [totalInvested, setTotalInvested] = useState(0);
//   const [totalProfitLoss, setTotalProfitLoss] = useState(0);
//   const [totalProfitLossPercent, setTotalProfitLossPercent] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch portfolio and wealth data
//   const fetchPortfolioAndWealth = async () => {
//     try {
//       setLoading(true);

//       // Fetch updated total wealth and total invested using /api/total-wealth/:userId
//       const wealthResponse = await axios.get(`/api/total-wealth/${currentUser.uid}`);
//       const fetchedTotalWealth = wealthResponse.data.totalWealth || 0;
//       const fetchedTotalInvested = wealthResponse.data.totalInvested || 0;

//       setTotalWealth(fetchedTotalWealth);
//       setTotalInvested(fetchedTotalInvested);

//       // Fetch aggregated portfolio
//       const response = await axios.get(`/api/portfolio/aggregate/${currentUser.uid}`);
//       const aggregatedPortfolio = response.data;

//       // Fetch latest price for each stock in the portfolio using fetchStockData
//       const updatedPortfolio = await Promise.all(
//         aggregatedPortfolio.map(async (stock) => {
//           const { ticker } = stock;
//           try {
//             const stockData = await fetchStockData(ticker);
//             const currentPrice = stockData?.price?.close || 0;
//             const totalValue = currentPrice * stock.totalQuantity;
//             return {
//               ...stock,
//               currentPrice,
//               totalValue,
//             };
//           } catch (error) {
//             console.error(`Error fetching data for ${ticker}:`, error);
//             return { ...stock, currentPrice: 0, totalValue: 0 };
//           }
//         })
//       );

//       setPortfolio(updatedPortfolio);

//       // Calculate total profit/loss
//       const totalCost = updatedPortfolio.reduce((sum, stock) => sum + stock.totalCost, 0);
//       const profitLoss = fetchedTotalWealth - totalCost;
//       const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

//       setTotalProfitLoss(profitLoss);
//       setTotalProfitLossPercent(profitLossPercent);

//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       setError("Failed to fetch portfolio data.");
//       console.error("Error fetching portfolio data:", err);
//     }
//   };

//   useEffect(() => {
//     if (currentUser) {
//       fetchPortfolioAndWealth();
//     }
//   }, [currentUser, fetchStockData]);

//   const handleCardClick = (ticker) => {
//     navigate(`/stock-details/${ticker}`);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Header setPortfolio={setPortfolio} />
//       <main className="flex flex-col items-start justify-start flex-grow p-4">
//         <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>

//         {loading ? (
//           <p className="text-center">Loading portfolio data...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : (
//           <>
//             {/* Overview Section with Card Styles */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//               <div className="bg-white shadow-md rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-bold">Total Wealth</h3>
//                 <p className="text-2xl font-semibold">
//                   ${totalWealth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </p>
//               </div>
//               <div className="bg-white shadow-md rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-bold">Total Invested</h3>
//                 <p className="text-2xl font-semibold">
//                   ${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </p>
//               </div>
//               <div className="bg-white shadow-md rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-bold">Profit</h3>
//                 <p
//                   className={`text-2xl font-semibold ${
//                     totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   ${totalProfitLoss.toLocaleString("en-US", { minimumFractionDigits: 2, })} (
//                   {totalProfitLossPercent.toFixed(2)}%)
//                 </p>
//               </div>
//             </div>

//             {/* Charts Section */}
//             <div className="flex flex-row justify-between items-start w-full mb-10 mt-10 gap-6">
//               <div className="flex justify-center items-center w-1/2 h-80">
//                 <PortfolioPieChart portfolio={portfolio} />
//               </div>
//               <div className="flex justify-center items-center w-1/2 h-80">
//                 <WealthAreaChart userId={currentUser.uid} />
//               </div>
//             </div>

//             {/* Stock Cards Section */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mb-12">
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
//                   Your portfolio is empty. Start adding stocks to track your investments!
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
//   const { currentUser, fetchStockData } = useAuth();
//   const navigate = useNavigate();
//   const [portfolio, setPortfolio] = useState([]);
//   const [totalWealth, setTotalWealth] = useState(0);
//   const [totalInvested, setTotalInvested] = useState(0);
//   const [totalProfitLoss, setTotalProfitLoss] = useState(0);
//   const [totalProfitLossPercent, setTotalProfitLossPercent] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch portfolio and wealth data
//   const fetchPortfolioAndWealth = async () => {
//     try {
//       setLoading(true);

//       // Fetch updated total wealth and total invested using /api/total-wealth/:userId
//       const wealthResponse = await axios.get(`/api/total-wealth/${currentUser.uid}`);
//       const fetchedTotalWealth = wealthResponse.data.totalWealth || 0;
//       const fetchedTotalInvested = wealthResponse.data.totalInvested || 0;

//       setTotalWealth(fetchedTotalWealth);
//       setTotalInvested(fetchedTotalInvested);

//       // Fetch aggregated portfolio
//       const response = await axios.get(`/api/portfolio/aggregate/${currentUser.uid}`);
//       const aggregatedPortfolio = response.data;

//       // Fetch latest price for each stock in the portfolio using fetchStockData
//       const updatedPortfolio = await Promise.all(
//         aggregatedPortfolio.map(async (stock) => {
//           const { ticker } = stock;
//           try {
//             const stockData = await fetchStockData(ticker);
//             const currentPrice = stockData?.price?.close || 0;
//             const totalValue = currentPrice * stock.totalQuantity;
//             return {
//               ...stock,
//               currentPrice,
//               totalValue,
//             };
//           } catch (error) {
//             console.error(`Error fetching data for ${ticker}:`, error);
//             return { ...stock, currentPrice: 0, totalValue: 0 };
//           }
//         })
//       );

//       setPortfolio(updatedPortfolio);

//       // Calculate total profit/loss
//       const totalCost = updatedPortfolio.reduce((sum, stock) => sum + stock.totalCost, 0);
//       const profitLoss = fetchedTotalWealth - totalCost;
//       const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

//       setTotalProfitLoss(profitLoss);
//       setTotalProfitLossPercent(profitLossPercent);

//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       setError("Failed to fetch portfolio data.");
//       console.error("Error fetching portfolio data:", err);
//     }
//   };

//   useEffect(() => {
//     if (currentUser) {
//       fetchPortfolioAndWealth();
//     }
//   }, [currentUser, fetchStockData]);

//   const handleCardClick = (ticker) => {
//     navigate(`/stock-details/${ticker}`);
//   };

//   return (
// <div className="flex flex-col min-h-screen bg-gray-100">
//   <Header setPortfolio={setPortfolio} />
//   <main className="flex flex-col items-start justify-start flex-grow p-4">
//     <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>

//     {loading ? (
//       <p className="text-center">Loading portfolio data...</p>
//     ) : error ? (
//       <p className="text-center text-red-500">{error}</p>
//     ) : (
//       <>
//         {/* Overview Section with Card Styles */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <div className="bg-white shadow-md rounded-lg p-4 text-center">
//             <h3 className="text-lg font-bold">Total Wealth</h3>
//             <p className="text-2xl font-semibold">
//               ${totalWealth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </p>
//           </div>
//           <div className="bg-white shadow-md rounded-lg p-4 text-center">
//             <h3 className="text-lg font-bold">Total Invested</h3>
//             <p className="text-2xl font-semibold">
//               ${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </p>
//           </div>
//           <div className="bg-white shadow-md rounded-lg p-4 text-center">
//             <h3 className="text-lg font-bold">Profit</h3>
//             <p
//               className={`text-2xl font-semibold ${
//                 totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
//               }`}
//             >
//               ${totalProfitLoss.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (
//               {totalProfitLossPercent.toFixed(2)}%)
//             </p>
//           </div>
//         </div>

//         {/* Charts Section in a Card */}
//         <div className="bg-white shadow-md rounded-lg p-6 w-full mb-10">
//           <h3 className="text-lg font-bold mb-4 text-center">Portfolio Analysis</h3>
//           <div className="flex flex-row justify-start items-start w-full gap-6">
//             <div className="flex justify-center items-center w-2/5 h-80">
//               <PortfolioPieChart portfolio={portfolio} />
//             </div>
//             <div className="flex justify-center items-center w-2/5 h-80">
//               <WealthAreaChart userId={currentUser.uid} />
//             </div>
//             <div className="flex justify-center items-center w-1/5 h-80"></div>
//           </div>
//         </div>

//         {/* Stock Cards Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mb-12">
//           {portfolio.length > 0 ? (
//             portfolio.map((stock, index) => (
//               <StockCard
//                 key={index}
//                 stock={stock}
//                 onClick={() => handleCardClick(stock.ticker)}
//               />
//             ))
//           ) : (
//             <p className="text-center text-gray-600">
//               Your portfolio is empty. Start adding stocks to track your investments!
//             </p>
//           )}
//         </div>
//       </>
//     )}
//   </main>
//   <Footer />
// </div>

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
import AverageSentimentBarChart from "../components/AverageSentimentBarChart";

const Dashboard = () => {
  const { currentUser, fetchStockData } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]);
  const [totalWealth, setTotalWealth] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [totalProfitLossPercent, setTotalProfitLossPercent] = useState(0);
  const [averageTickerSentiment, setAverageTickerSentiment] = useState(0); // New state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch portfolio and wealth data
  const fetchPortfolioAndWealth = async () => {
    try {
      setLoading(true);

      // Fetch updated total wealth and total invested using /api/total-wealth/:userId
      const wealthResponse = await axios.get(
        `/api/total-wealth/${currentUser.uid}`
      );
      const fetchedTotalWealth = wealthResponse.data.totalWealth || 0;
      const fetchedTotalInvested = wealthResponse.data.totalInvested || 0;

      setTotalWealth(fetchedTotalWealth);
      setTotalInvested(fetchedTotalInvested);

      // Fetch aggregated portfolio
      const response = await axios.get(
        `/api/portfolio/aggregate/${currentUser.uid}`
      );
      const aggregatedPortfolio = response.data;

      // Fetch latest price and sentiment for each stock in the portfolio
      const updatedPortfolio = await Promise.all(
        aggregatedPortfolio.map(async (stock) => {
          const { ticker } = stock;
          try {
            const stockData = await fetchStockData(ticker);
            const currentPrice = stockData?.price?.close || 0;
            const tickerSentiment =
              stockData?.sentiment?.tickerSentimentScore || 0;
            const totalValue = currentPrice * stock.totalQuantity;
            return {
              ...stock,
              currentPrice,
              tickerSentiment, // Add sentiment score
              totalValue,
            };
          } catch (error) {
            console.error(`Error fetching data for ${ticker}:`, error);
            return {
              ...stock,
              currentPrice: 0,
              totalValue: 0,
              tickerSentiment: 0,
            };
          }
        })
      );

      setPortfolio(updatedPortfolio);

      // Calculate total profit/loss
      const totalCost = updatedPortfolio.reduce(
        (sum, stock) => sum + stock.totalCost,
        0
      );
      const profitLoss = fetchedTotalWealth - totalCost;
      const profitLossPercent =
        totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

      setTotalProfitLoss(profitLoss);
      setTotalProfitLossPercent(profitLossPercent);

      // Calculate average ticker sentiment
      const totalSentiment = updatedPortfolio.reduce(
        (sum, stock) => sum + stock.tickerSentiment,
        0
      );
      const avgSentiment =
        updatedPortfolio.length > 0
          ? totalSentiment / updatedPortfolio.length
          : 0;
      setAverageTickerSentiment(avgSentiment.toFixed(3)); // Round to 3 decimals

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Failed to fetch portfolio data.");
      console.error("Error fetching portfolio data:", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchPortfolioAndWealth();
    }
  }, [currentUser, fetchStockData]);

  const handleCardClick = (ticker) => {
    navigate(`/stock-details/${ticker}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header setPortfolio={setPortfolio} />
      <main className="flex flex-col items-start justify-start flex-grow p-4">
        <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>

        {loading ? (
          <p className="text-center">Loading portfolio data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white shadow-md rounded-lg p-4 text-center">
                <h3 className="text-lg font-bold">Total Wealth</h3>
                <p className="text-2xl font-semibold">
                  $
                  {totalWealth.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 text-center">
                <h3 className="text-lg font-bold">Total Invested</h3>
                <p className="text-2xl font-semibold">
                  $
                  {totalInvested.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 text-center">
                <h3 className="text-lg font-bold">Profit</h3>
                <p
                  className={`text-2xl font-semibold ${
                    totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  $
                  {totalProfitLoss.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ({totalProfitLossPercent.toFixed(2)}%)
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Portfolio Analysis</h2>

            {/* Charts Section */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full mb-10">
              <div className="flex flex-col md:flex-row justify-between items-start w-full gap-6">
                {/* Portfolio Pie Chart */}
                <div className="flex justify-center items-center w-full md:w-1/3 h-80">
                  <PortfolioPieChart portfolio={portfolio} />
                </div>

                {/* Wealth Area Chart */}
                <div className="flex justify-center items-center w-full md:w-1/3 h-80">
                  <WealthAreaChart userId={currentUser.uid} />
                </div>

                {/* Average Sentiment Chart */}
                <div className="flex justify-center items-center w-full md:w-1/3 h-80">
                  <AverageSentimentBarChart
                    averageTickerSentiment={averageTickerSentiment}
                  />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Stocks in Portfolio</h2>

            {/* Stock Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mb-12">
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
