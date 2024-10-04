import { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/login"); // Redirect to login page after successful signup
        } catch (error) {
            switch (error.code) {
                case "auth/invalid-email":
                    setError("Invalid email format.");
                    break;
                case "auth/email-already-in-use":
                    setError("Email already in use.");
                    break;
                case "auth/weak-password":
                    setError("Password should be at least 6 characters.");
                    break;
                default:
                    setError("Failed to sign up. Please try again.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input 
                    type="email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                />
                <input 
                    type="password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                />
                <button 
                    onClick={handleSignup} 
                    className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300"
                >
                    Sign Up
                </button>
                <button 
                    onClick={() => navigate("/login")}
                    className="w-full bg-gray-100 text-green-500 p-3 rounded-lg hover:bg-gray-200 transition duration-300 mt-4"
                >
                    Already have an account? Log In
                </button>
            </div>
        </div>
    );
};

export default Signup;