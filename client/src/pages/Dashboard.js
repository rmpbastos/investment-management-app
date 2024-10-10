// import { useEffect, useState } from "react";
// import { useAuth } from "../context/UserContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import SearchStock from "../components/SearchStock";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// const Dashboard = () => {
//     const { currentUser } = useAuth();
//     const navigate = useNavigate();
//     const [portfolio, setPortfolio] = useState([]);

//     useEffect(() => {
//         const fetchPortfolio = async () => {
//             try {
//                 const response = await axios.get(`/api/portfolio/${currentUser.uid}`);
//                 setPortfolio(response.data);
//             } catch (error) {
//                 console.error('Error fetching portfolio:', error);
//             }
//         };

//         if (currentUser) {
//             fetchPortfolio();
//         }
//     }, [currentUser]);

//     return (
//         <div className="flex flex-col min-h-screen">
//             <Header />
//             <main className="flex flex-col items-center justify-center flex-grow bg-gray-100 p-6">
//                 <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard!</h1>
//                 {currentUser && (
//                     <p className="text-xl mb-8">Logged in as: <span className="font-semibold">{currentUser.email}</span></p>
//                 )}
//                 <div className="flex flex-col items-center justify-center">
//                     <div className="mb-8 w-full">
//                         <SearchStock setPortfolio={setPortfolio} />
//                     </div>
//                 </div>
//                 <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mt-6">
//                     <h2 className="text-2xl font-semibold mb-4">Your Portfolio</h2>
//                     {portfolio.length > 0 ? (
//                         <ul className="space-y-2">
//                             {portfolio.map((stock, index) => (
//                                 <li key={index} className="border-b py-2">
//                                     <p><strong>Symbol:</strong> {stock.ticker}</p>
//                                     <p><strong>Name:</strong> {stock.name}</p>
//                                     <p><strong>Asset Type:</strong> {stock.assetType}</p>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p>No stocks in portfolio</p>
//                     )}
//                 </div>
//             </main>
//             <Footer />
//         </div>
//     );
// };

// export default Dashboard;




// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import { useAuth } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(`/api/portfolio/${currentUser.uid}`);
        setPortfolio(response.data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      }
    };

    if (currentUser) {
      fetchPortfolio();
    }
  }, [currentUser]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header setPortfolio={setPortfolio} />
      <main className="flex flex-col items-center justify-center flex-grow bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard!</h1>
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mt-6">
          <h2 className="text-2xl font-semibold mb-4">Your Portfolio</h2>
          {portfolio.length > 0 ? (
            <ul className="space-y-2">
              {portfolio.map((stock, index) => (
                <li key={index} className="border-b py-2">
                  <p><strong>Symbol:</strong> {stock.ticker}</p>
                  <p><strong>Name:</strong> {stock.name}</p>
                  <p><strong>Asset Type:</strong> {stock.assetType}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No stocks in portfolio</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

