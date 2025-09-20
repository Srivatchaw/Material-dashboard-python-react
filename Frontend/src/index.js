import React from "react";
import { createRoot } from "react-dom/client"; // Use createRoot for React 18
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";

// Import AuthProvider
import { AuthProvider } from "./contexts/AuthContext"; // Add this import

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      {/* AuthProvider should wrap your App component */}
      <AuthProvider>
        {" "}
        {/* Add AuthProvider here */}
        <App />
      </AuthProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
