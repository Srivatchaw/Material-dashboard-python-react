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
  const [errors, setErrors] = useState({}); // <--- ADDED for inline errors
  const navigate = useNavigate();

  const openSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => setSnackbarOpen(false);

  // Email validation regex (simple, for basic check)
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordStrong = (password) => password.length >= 6; // Example: Minimum password length

  // --- Individual Field Validation Function for Sign-up ---
  const validateField = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "username":
        if (!value.trim()) errorMessage = "Username cannot be empty.";
        break;
      case "email":
        if (!value.trim()) errorMessage = "Email cannot be empty.";
        else if (!isValidEmail(value)) errorMessage = "Please enter a valid email address.";
        break;
      case "password":
        if (!value.trim()) errorMessage = "Password cannot be empty.";
        else if (!isPasswordStrong(value))
          errorMessage = "Password must be at least 6 characters long.";
        break;
      case "termsAccepted":
        if (!value) errorMessage = "You must accept the Terms and Conditions to register.";
        break;
      default:
        break;
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

    // Validate all fields
    const fieldsToValidate = { username, email, password, termsAccepted };
    for (const fieldName in fieldsToValidate) {
      const errorMessage = validateField(fieldName, fieldsToValidate[fieldName]);
      if (errorMessage) {
        newErrors[fieldName] = errorMessage;
        formIsValid = false;
      }
    }
    setErrors(newErrors);
    return formIsValid;
  };
  // --- End Validation Functions ---

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (!validateAllFormFields()) {
      // <--- Use full validation here
      openSnackbar("Please address these errors first.", "error");
      return;
    }

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
        openSnackbar(`Error: ${error.response.data.message}`, "error");
      } else if (error.request) {
        openSnackbar("Error: No response from server. Check if the backend is running.", "error");
      } else {
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
                onBlur={(e) => handleBlur("username", e.target.value)} // <--- ADD onBlur
                error={!!errors.username} // <--- Display error
              />
              {errors.username && (
                <MDTypography variant="caption" color="error" display="block">
                  {errors.username}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)} // <--- ADD onBlur
                error={!!errors.email} // <--- Display error
              />
              {errors.email && (
                <MDTypography variant="caption" color="error" display="block">
                  {errors.email}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) => handleBlur("password", e.target.value)} // <--- ADD onBlur
                error={!!errors.password} // <--- Display error
              />
              {errors.password && (
                <MDTypography variant="caption" color="error" display="block">
                  {errors.password}
                </MDTypography>
              )}
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      // Also validate on change for immediate feedback
                      handleBlur("termsAccepted", e.target.checked);
                    }}
                    error={!!errors.termsAccepted} // <--- Display error
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
              {errors.termsAccepted && (
                <MDTypography variant="caption" color="error" display="block">
                  {errors.termsAccepted}
                </MDTypography>
              )}
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
