import { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);  // Store error message

    const handleSignup = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User signed up:', userCredential);
        } catch (error) {
            // Catch the Firebase error and display it
            switch (error.code) {
                case 'auth/invalid-email':
                    setError('The email address is invalid.');
                    break;
                case 'auth/email-already-in-use':
                    setError('This email is already in use.');
                    break;
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters.');
                    break;
                default:
                    setError('Failed to sign up. Please try again.');
            }
            console.error('Error signing up:', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>} {/* Error message */}
                <input 
                    type="email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                    className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <input 
                    type="password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <button 
                    onClick={handleSignup} 
                    className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default Signup;