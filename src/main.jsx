import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './contexts/UserContext.jsx'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";

import "./index.css";
import ProtectedRoute from './components/ProtectedRoute.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate replace to="/home" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/home",
    element: <ProtectedRoute> <HomePage /> </ProtectedRoute>,
  },
  {
    path: "/explore",
    element: <ProtectedRoute> <ExplorePage /> </ProtectedRoute>,
  },
  {
    path: "/user/:id",
    element: <ProtectedRoute> <Profile /> </ProtectedRoute>,
  },
  {
    path: "*",
    element: <Navigate replace to="/home" />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
