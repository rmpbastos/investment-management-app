/*
    This component provides authentication state management across all components.
*/

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig"

const UserContext = createContext();

export const useAuth = () => useContext(UserContext);

export const AuthProvider = ({ children }) => {
    const[currentUser, setCurrentUser] = useState(null);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <UserContext.Provider value={{ currentUser }}>
            { children }
        </UserContext.Provider>
    );
};