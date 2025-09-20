import React, { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types"; // Import PropTypes

// Create a context for authentication
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Stores user details like username, user_id from backend

  // On initial load, check if user data exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.username && parsedUser.user_id) {
          // Basic check for valid user data
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log("User found in localStorage, setting authenticated:", parsedUser.username);
        } else {
          localStorage.removeItem("user"); // Remove invalid data
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem("user"); // Clear corrupted data
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  // Function to handle user login
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Store user info (e.g., username, user_id)
    console.log("User logged in, data stored:", userData);
  };

  // Function to handle user logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user"); // Clear stored info on logout
    console.log("User logged out.");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add propTypes validation for AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // 'children' can be anything renderable (elements, strings, etc.)
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
