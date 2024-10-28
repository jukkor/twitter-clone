import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
    const user = useUser();

    if (!user) {
        // Redirect to login if not logged in
        return <Navigate to="/login" />;
    }

    // Render the nested component if logged in
    return children;
};

export default ProtectedRoute;
