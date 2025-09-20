import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function Cover() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("error");
  const navigate = useNavigate();

  const openSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => setSnackbarOpen(false);

  // Email validation regex (simple, for basic check)
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignUp = async (event) => {
    event.preventDefault();

    // --- Frontend Validation ---
    if (!username.trim()) {
      openSnackbar("Username cannot be empty.", "error");
      return;
    }
    if (!email.trim()) {
      openSnackbar("Email cannot be empty.", "error");
      return;
    }
    if (!isValidEmail(email)) {
      openSnackbar("Please enter a valid email address.", "error");
      return;
    }
    if (!password.trim()) {
      openSnackbar("Password cannot be empty.", "error");
      return;
    }
    if (password.length < 6) {
      // Example: Minimum password length
      openSnackbar("Password must be at least 6 characters long.", "error");
      return;
    }
    if (!termsAccepted) {
      openSnackbar("You must accept the Terms and Conditions to register.", "error");
      return;
    }
    // --- End Frontend Validation ---

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/auth/signup", {
        username,
        email,
        password,
      });
      openSnackbar(response.data.message, "success");
      setTimeout(() => {
        navigate("/authentication/sign-in");
      }, 2000);
    } catch (error) {
      if (error.response) {
        // Backend returned an error response (e.g., 400, 409, 500)
        openSnackbar(`Error: ${error.response.data.message}`, "error");
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        openSnackbar("Error: No response from server. Check if the backend is running.", "error");
      } else {
        // Something happened in setting up the request that triggered an Error
        openSnackbar("An unexpected error occurred during signup.", "error");
      }
      console.error("Signup error:", error);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your username, email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSignUp}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                variant="standard"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!username.trim() && snackbarOpen && snackbarMessage.includes("Username")} // Highlight if empty and snackbar is open
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={
                  (!email.trim() || (email.trim() && !isValidEmail(email))) &&
                  snackbarOpen &&
                  snackbarMessage.includes("Email")
                } // Highlight if empty or invalid
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={
                  (!password.trim() || (password.trim() && password.length < 6)) &&
                  snackbarOpen &&
                  snackbarMessage.includes("Password")
                } // Highlight if empty or too short
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    // Highlight if not accepted and snackbar is open for terms
                    error={!termsAccepted && snackbarOpen && snackbarMessage.includes("Terms")}
                  />
                }
                label={
                  <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    sx={{ cursor: "pointer", userSelect: "none" }}
                  >
                    &nbsp;&nbsp;I agree the&nbsp;
                    <MDTypography
                      component="a"
                      href="#"
                      variant="button"
                      fontWeight="bold"
                      color="info"
                      textGradient
                    >
                      Terms and Conditions
                    </MDTypography>
                  </MDTypography>
                }
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                sign up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
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
    </CoverLayout>
  );
}

Cover.propTypes = {
  // Add propTypes for any props passed to Cover if necessary
};

export default Cover;
