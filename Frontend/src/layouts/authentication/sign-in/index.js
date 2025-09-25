import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
// import Switch from "@mui/material/Switch"; // Not needed
import Icon from "@mui/material/Icon"; // Ensure Icon is imported for any potential usage

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

// Auth Context
import { useAuth } from "contexts/AuthContext";

function Basic() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("error");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(""); // <--- ADDED: State for general error message
  const navigate = useNavigate();
  const { login } = useAuth();

  const openSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => setSnackbarOpen(false);

  const validateField = (fieldName, value) => {
    let errorMessage = "";
    if (!value.trim()) {
      errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot be empty.`;
    }
    return errorMessage;
  };

  const handleBlur = (fieldName, value) => {
    const errorMessage = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
  };

  const validateAllFormFields = () => {
    let newErrors = {};
    let formIsValid = true;

    if (!username.trim()) {
      newErrors.username = "Username cannot be empty.";
      formIsValid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Password cannot be empty.";
      formIsValid = false;
    }
    setErrors(newErrors);
    return formIsValid;
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setGeneralError(""); // <--- Clear previous general errors on new attempt

    if (!validateAllFormFields()) {
      // If client-side validation fails for empty fields, show a general message or first error
      const firstError = Object.values(errors).find((msg) => msg);
      setGeneralError(firstError || "Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/auth/signin", {
        username,
        password,
      });
      // openSnackbar(response.data.message, "success"); // Removed snackbar for success on signin
      login(response.data);
      navigate("/dashboard"); // Navigate immediately on success as per image example
    } catch (error) {
      if (error.response) {
        // Backend returned an error response (e.g., 401 for invalid credentials)
        setGeneralError(error.response.data.message || "Invalid username or password."); // <--- Set general error
      } else if (error.request) {
        setGeneralError("No response from server. Check if the backend is running."); // <--- Set general error
      } else {
        setGeneralError("An unexpected error occurred during signin."); // <--- Set general error
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
                onBlur={(e) => handleBlur("username", e.target.value)}
                error={!!errors.username}
              />
              {errors.username && (
                <MDTypography variant="caption" color="error" display="block">
                  {errors.username}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) => handleBlur("password", e.target.value)}
                error={!!errors.password}
              />
              {errors.password && (
                <MDTypography variant="caption" color="error" display="block">
                  {errors.password}
                </MDTypography>
              )}
            </MDBox>

            {/* --- NEW: Simple Error Message Display above the button --- */}
            {generalError && (
              <MDBox mb={2} textAlign="center">
                <MDTypography variant="button" color="error" fontWeight="medium">
                  {generalError}
                </MDTypography>
              </MDBox>
            )}
            {/* --- END NEW: Simple Error Message Display --- */}

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

      {/* MDSnackbar can still be used for other alerts if needed, but not for sign-in errors directly */}
      {/* <MDSnackbar
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
      </MDSnackbar> */}
    </BasicLayout>
  );
}

Basic.propTypes = {
  // Add propTypes for any props passed to Basic if necessary
};

export default Basic;
