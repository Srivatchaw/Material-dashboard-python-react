import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import PropTypes from 'prop-types'; // Not used directly in this component's props

// @mui material components
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon"; // For error icon
import Grid from "@mui/material/Grid"; // <--- Import Grid

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Auth Context
import { useAuth } from "contexts/AuthContext";

function CreateItem() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // States for all new fields
  const [projectName, setProjectName] = useState("");
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD format
  const [expectedCompletionDate, setExpectedCompletionDate] = useState(""); // YYYY-MM-DD format
  const [actualCompletionDate, setActualCompletionDate] = useState(""); // YYYY-MM-DD format, optional
  const [status, setStatus] = useState("Pending");
  const [reasonForDelay, setReasonForDelay] = useState(""); // Optional

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("error");

  // State to track validation errors for each field
  const [errors, setErrors] = useState({});

  const openSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => setSnackbarOpen(false);

  const validateForm = () => {
    let newErrors = {};
    let formIsValid = true;

    if (!projectName.trim()) {
      newErrors.projectName = "The project name is required.";
      formIsValid = false;
    }
    if (!formName.trim()) {
      newErrors.formName = "The form name is required.";
      formIsValid = false;
    }
    if (!startDate) {
      newErrors.startDate = "The start date is required.";
      formIsValid = false;
    }
    if (!expectedCompletionDate) {
      newErrors.expectedCompletionDate = "The expected completion date is required.";
      formIsValid = false;
    }
    if (!status.trim()) {
      newErrors.status = "The status is required.";
      formIsValid = false;
    }

    // Add more validation rules as needed (e.g., date formats, date comparisons)

    setErrors(newErrors);
    return formIsValid;
  };

  const handleCreateItem = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      openSnackbar("Please address these errors first.", "error");
      return;
    }
    if (!user || !user.user_id) {
      openSnackbar("User not authenticated. Please sign in.", "error");
      navigate("/authentication/sign-in");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/items/create",
        {
          project_name: projectName,
          form_name: formName,
          description: description,
          start_date: startDate,
          expected_completion_date: expectedCompletionDate,
          actual_completion_date: actualCompletionDate || null, // Send null if empty
          status: status,
          reason_for_delay: reasonForDelay,
        },
        {
          headers: {
            "X-User-ID": user.user_id,
          },
        }
      );
      console.log("Item creation successful response:", response.data);
      openSnackbar(response.data.message, "success");
      setTimeout(() => {
        navigate("/tables");
      }, 2000);
    } catch (error) {
      if (error.response) {
        openSnackbar(`Error creating item: ${error.response.data.message}`, "error");
      } else if (error.request) {
        openSnackbar("Error: No response from server. Check if the backend is running.", "error");
      } else {
        openSnackbar("An unexpected error occurred during item creation.", "error");
      }
      console.error("Create item error:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} minHeight="calc(100vh - 180px)" display="flex" alignItems="center">
        <MDBox
          component={Card}
          maxWidth="lg" // <--- Increased max width for more side-by-side space
          mx="auto"
          p={3}
          width="100%"
        >
          <MDBox p={2} lineHeight={1} textAlign="center">
            <MDTypography variant="h5" fontWeight="medium">
              Create New Item
            </MDTypography>
            <MDTypography variant="button" color="text">
              Fill in the details for your new item.
            </MDTypography>
          </MDBox>

          {Object.keys(errors).length > 0 && snackbarOpen && snackbarColor === "error" && (
            <MDBox bgColor="error" color="white" borderRadius="md" p={1.5} mb={2}>
              <MDTypography
                variant="button"
                color="white"
                fontWeight="bold"
                display="flex"
                alignItems="center"
              >
                <Icon fontSize="small" sx={{ mr: 1 }}>
                  warning
                </Icon>{" "}
                Hang on, let&apos;s address these errors first
              </MDTypography>
              <MDBox component="ul" mt={1} pl={2}>
                {Object.values(errors).map((error, index) => (
                  <MDTypography key={index} component="li" variant="caption" color="white">
                    {error}
                  </MDTypography>
                ))}
              </MDBox>
            </MDBox>
          )}

          <MDBox component="form" role="form" onSubmit={handleCreateItem} pt={2}>
            <Grid container spacing={3}>
              {" "}
              {/* <--- Use Grid container */}
              <Grid item xs={12} sm={6}>
                {" "}
                {/* <--- Project Name (half width on small, full on extra small) */}
                <MDInput
                  type="text"
                  label="Project Name *"
                  fullWidth
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    if (errors.projectName) setErrors((prev) => ({ ...prev, projectName: "" }));
                  }}
                  error={!!errors.projectName}
                />
                {errors.projectName && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.projectName}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {" "}
                {/* <--- Form Name (half width on small, full on extra small) */}
                <MDInput
                  type="text"
                  label="Form Name *"
                  fullWidth
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (errors.formName) setErrors((prev) => ({ ...prev, formName: "" }));
                  }}
                  error={!!errors.formName}
                />
                {errors.formName && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.formName}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {" "}
                {/* <--- Start Date */}
                <MDInput
                  type="date"
                  label="Start Date *"
                  fullWidth
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: "" }));
                  }}
                  error={!!errors.startDate}
                  InputLabelProps={{ shrink: true }}
                />
                {errors.startDate && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.startDate}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {" "}
                {/* <--- Expected Completion Date */}
                <MDInput
                  type="date"
                  label="Expected Completion Date *"
                  fullWidth
                  value={expectedCompletionDate}
                  onChange={(e) => {
                    setExpectedCompletionDate(e.target.value);
                    if (errors.expectedCompletionDate)
                      setErrors((prev) => ({ ...prev, expectedCompletionDate: "" }));
                  }}
                  error={!!errors.expectedCompletionDate}
                  InputLabelProps={{ shrink: true }}
                />
                {errors.expectedCompletionDate && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.expectedCompletionDate}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {" "}
                {/* <--- Actual Completion Date */}
                <MDInput
                  type="date"
                  label="Actual Completion Date (Optional)"
                  fullWidth
                  value={actualCompletionDate}
                  onChange={(e) => setActualCompletionDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {" "}
                {/* <--- Status */}
                <MDInput
                  select
                  label="Status *"
                  fullWidth
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    if (errors.status) setErrors((prev) => ({ ...prev, status: "" }));
                  }}
                  error={!!errors.status}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </MDInput>
                {errors.status && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.status}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12}>
                {" "}
                {/* <--- Reason for Delay (full width) */}
                <MDInput
                  type="text"
                  label="Reason for Delay (Optional)"
                  fullWidth
                  multiline
                  rows={2}
                  value={reasonForDelay}
                  onChange={(e) => setReasonForDelay(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                {" "}
                {/* <--- Description (full width) */}
                <MDInput
                  type="text"
                  label="Description (Optional)"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
            </Grid>

            <MDBox mt={4} mb={1}>
              <Stack direction="row" spacing={2} justifyContent="center">
                <MDButton variant="gradient" color="info" type="submit">
                  Create Item
                </MDButton>
                <MDButton variant="text" color="dark" onClick={() => navigate("/tables")}>
                  Cancel
                </MDButton>
              </Stack>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
      <Footer />
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
    </DashboardLayout>
  );
}

// PropTypes (if CreateItem receives any props)
CreateItem.propTypes = {
  // Add propTypes here if CreateItem is expected to receive props
};

export default CreateItem;
