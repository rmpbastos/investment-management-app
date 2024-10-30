import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useAuth } from "../context/UserContext";
import SearchStock from "./SearchStock";

const Header = ({ setPortfolio }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="/icon_sm.png"
          alt="InvestWise Logo"
          className="h-8 w-8 mr-2"
        />
        <h1 className="text-lg font-bold text-gray-800">InvestWise</h1>
      </div>
      <nav className="flex-grow ml-8">
        <button
          className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400 transition"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
      </nav>
      <div className="relative w-1/3 mr-4">
        <SearchStock setPortfolio={setPortfolio} />
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-1 px-1 rounded-lg hover:bg-red-600 transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
          />
        </svg>
      </button>
    </header>
  );
};

export default Header;





// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebaseConfig";
// import { useAuth } from "../context/UserContext";
// import SearchStock from "./SearchStock";
// import axios from "axios";

// const Header = ({ setPortfolio }) => {
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();
//   const [totalWealth, setTotalWealth] = useState(0); // State for total wealth

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate("/login");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   // Fetch user profile to get total wealth
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const response = await axios.get(`/api/user-profile/${currentUser.uid}`);
//         const userProfile = response.data;
//         setTotalWealth(userProfile.totalWealth || 0);
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//       }
//     };

//     if (currentUser) {
//       fetchUserProfile();
//     }
//   }, [currentUser]);

//   return (
//     <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
//       <div className="flex items-center">
//         <img src="/icon_sm.png" alt="InvestWise Logo" className="h-8 w-8 mr-2" />
//         <h1 className="text-lg font-bold text-gray-800">InvestWise</h1>
//       </div>
//       <nav className="flex-grow ml-8">
//         <button
//           className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400 transition"
//           onClick={() => navigate("/dashboard")}
//         >
//           Dashboard
//         </button>
//       </nav>
//       <div className="mr-4">
//         <p className="text-lg font-bold text-gray-800">
//           Total Wealth: ${totalWealth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//         </p>
//       </div>
//       <div className="relative w-1/3 mr-4">
//         <SearchStock setPortfolio={setPortfolio} />
//       </div>
//       <button
//         onClick={handleLogout}
//         className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition duration-300"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
//           />
//         </svg>
//       </button>
//     </header>
//   );
// };

// export default Header;

