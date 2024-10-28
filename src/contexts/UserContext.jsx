import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        })

        return () => unsubscribe();

    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
};

export const useUser = () => useContext(UserContext);
