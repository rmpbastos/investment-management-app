import { useAuth } from "../context/UserContext";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard!</h1>
            {currentUser && (
                <p className="text-xl">Logged in as: <span className="font-semibold">{currentUser.email}</span></p>
            )}
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