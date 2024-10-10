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
        <img src="/icon_sm.png" alt="InvestWise Logo" className="h-8 w-8 mr-2" />
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
        className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition duration-300"
      >
        Log Out
      </button>
    </header>
  );
};

export default Header;