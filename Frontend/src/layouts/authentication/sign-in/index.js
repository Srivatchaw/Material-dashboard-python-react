import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types"; // Ensure this is imported

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar"; // For showing alerts

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

// Auth Context
import { useAuth } from "contexts/AuthContext";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("error");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const openSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => setSnackbarOpen(false);

  const handleSignIn = async (event) => {
    event.preventDefault();

    // --- Frontend Validation ---
    if (!username.trim()) {
      openSnackbar("Username cannot be empty.", "error");
      return;
    }
    if (!password.trim()) {
      openSnackbar("Password cannot be empty.", "error");
      return;
    }
    // You could add more complex password validation here if desired,
    // but typically for sign-in, it's just checking if it's not empty.
    // --- End Frontend Validation ---

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/auth/signin", {
        username,
        password,
      });
      openSnackbar(response.data.message, "success");
      login(response.data);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      if (error.response) {
        // Backend returned an error response (e.g., 400 for missing fields, 401 for invalid credentials)
        openSnackbar(`Error: ${error.response.data.message}`, "error");
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        openSnackbar("Error: No response from server. Check if the backend is running.", "error");
      } else {
        // Something happened in setting up the request that triggered an Error
        openSnackbar("An unexpected error occurred during signin.", "error");
      }
      console.error("Signin error:", error);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign In
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your username and password to sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSignIn}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!username.trim() && snackbarOpen && snackbarMessage.includes("Username")} // Highlight if empty and snackbar is open
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!password.trim() && snackbarOpen && snackbarMessage.includes("Password")} // Highlight if empty and snackbar is open
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign Up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      <MDSnackbar
        color={snackbarColor}
        icon={snackbarColor === "success" ? "check" : "warning"}
        title="Alert"
        dateTime={new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}
        open={snackbarOpen}
        onClose={closeSnackbar}
        close={closeSnackbar}
        bgWhite
      >
        {snackbarMessage}
      </MDSnackbar>
    </BasicLayout>
  );
}

Basic.propTypes = {
  // Add propTypes for any props passed to Basic if necessary
};

export default Basic;
