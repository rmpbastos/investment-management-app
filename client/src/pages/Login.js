import { useState } from "react";
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard'); // Redirect to dashboard after successful login
        } catch (error) {
            switch (error.code) {
                case 'auth/invalid-email':
                    setError('Invalid email format.');
                    break;
                case 'auth/user-not-found':
                    setError('No account found with this email.');
                    break;
                case 'auth/wrong-password': 
                    setError('Incorrect password.');
                    break;
                default:
                    setError('Failed to log in. Please try again.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Log In</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input 
                    type="email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
                <input 
                    type="password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
                <button 
                    onClick={handleLogin} 
                    className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition duration-300"
                >
                    Log In
                </button>
                <button 
                    onClick={() => navigate('/signup')} 
                    className="w-full bg-gray-100 text-indigo-500 p-3 rounded-lg hover:bg-gray-200 transition duration-300 mt-4"
                >
                    Don't have an account? Sign Up
                </button>
            </div>
        </div>
    );
};

export default Login;