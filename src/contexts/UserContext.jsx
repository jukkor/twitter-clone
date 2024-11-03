import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase/firebase';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const userInLocalStorage = localStorage.getItem("user");
        return userInLocalStorage ? JSON.parse(userInLocalStorage) : null;
    });

    useEffect(() => {
        // Store or remove user in localStorage on change
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
        });

        return unsubscribe; // Clean up listener on unmount
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
