import { useEffect, useState } from "react";
import { useAuth } from "../context/UserContext";
import axios from "axios";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import SearchStock from '../components/SearchStock';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState([]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

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
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard!</h1>
            {currentUser && (
                <p className="text-xl mb-8">Logged in as: <span className="font-semibold">{currentUser.email}</span></p>
            )}
            <div className="flex flex-col items-center justify-center">
                <div className="mb-8 w-full">
                    <SearchStock setPortfolio={setPortfolio} />
                </div>
            </div>
            
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
            <button 
                onClick={handleLogout} 
                className="mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
            >
                Log Out
            </button>
        </div>
    );
};

export default Dashboard;