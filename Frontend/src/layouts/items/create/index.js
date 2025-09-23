// src/layouts/items/create/index.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import PropTypes from 'prop-types'; // Not used directly in this component's props

// @mui material components
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";

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

  // Existing states (renamed for clarity where needed)
  const [projectName, setProjectName] = useState("");
  const [formName, setFormName] = useState("");
  // const [description, setDescription] = useState(""); // <--- REMOVED from useState and JSX
  const [startDate, setStartDate] = useState("");
  const [expectedCompletionDate, setExpectedCompletionDate] = useState("");
  const [actualCompletionDate, setActualCompletionDate] = useState("");
  const [status, setStatus] = useState("Pending");
  // const [reasonForDelay, setReasonForDelay] = useState(""); // <--- REMOVED from useState and JSX

  // --- NEW STATES FOR YOUR FIELDS ---
  const [customer, setCustomer] = useState("");
  const [publicIp, setPublicIp] = useState("");
  const [privateIp, setPrivateIp] = useState("");
  const [osType, setOsType] = useState("");
  const [rootUsername, setRootUsername] = useState("");
  const [rootPassword, setRootPassword] = useState("");
  const [serverUsername, setServerUsername] = useState("");
  const [serverPassword, setServerPassword] = useState("");
  const [serverName, setServerName] = useState("");
  const [core, setCore] = useState("");
  const [ram, setRam] = useState("");
  const [hdd, setHdd] = useState("");
  const [ports, setPorts] = useState("");
  const [location, setLocation] = useState("");
  const [applications, setApplications] = useState("");
  const [dbName, setDbName] = useState("");
  const [dbPassword, setDbPassword] = useState("");
  const [dbPort, setDbPort] = useState("");
  const [dumpLocation, setDumpLocation] = useState("");
  const [crontabConfig, setCrontabConfig] = useState("");
  const [backupLocation, setBackupLocation] = useState("");
  const [url, setUrl] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // --- END NEW STATES ---

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("error");
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
      newErrors.projectName = "Project Name is required.";
      formIsValid = false;
    }
    if (!formName.trim()) {
      newErrors.formName = "Form Name is required.";
      formIsValid = false;
    }
    // if (!startDate) { newErrors.startDate = "Start Date is required."; formIsValid = false; } // No longer required
    // if (!expectedCompletionDate) { newErrors.expectedCompletionDate = "Expected Completion Date is required."; formIsValid = false; } // No longer required
    // if (!status.trim()) { newErrors.status = "Status is required."; formIsValid = false; } // No longer required
    if (!customer.trim()) {
      newErrors.customer = "Customer name is required.";
      formIsValid = false;
    }
    if (!serverName.trim()) {
      newErrors.serverName = "Server Name is required.";
      formIsValid = false;
    }

    // Add validation for other fields as needed (e.g., IP format, URL format)
    if (publicIp && !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(publicIp)) {
      newErrors.publicIp = "Invalid Public IP format.";
      formIsValid = false;
    }
    if (privateIp && !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(privateIp)) {
      newErrors.privateIp = "Invalid Private IP format.";
      formIsValid = false;
    }
    if (url && !/^https?:\/\/\S+$/.test(url)) {
      newErrors.url = "Invalid URL format.";
      formIsValid = false;
    }
    if (core && (isNaN(core) || parseInt(core, 10) < 1)) {
      newErrors.core = "Core must be a positive number.";
      formIsValid = false;
    }
    if (dbPort && (isNaN(dbPort) || parseInt(dbPort, 10) < 1 || parseInt(dbPort, 10) > 65535)) {
      newErrors.dbPort = "DB Port must be a valid port number.";
      formIsValid = false;
    }

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
          // description: description, // REMOVED from payload
          start_date: startDate || null, // Send null if empty
          expected_completion_date: expectedCompletionDate || null, // Send null if empty
          actual_completion_date: actualCompletionDate || null,
          status: status, // Send current status
          // reason_for_delay: reasonForDelay, // REMOVED from payload
          // --- NEW FIELDS PAYLOAD ---
          customer,
          public_ip: publicIp,
          private_ip: privateIp,
          os_type: osType,
          root_username: rootUsername,
          root_password: rootPassword,
          server_username: serverUsername,
          server_password: serverPassword,
          server_name: serverName,
          core: core ? parseInt(core, 10) : null,
          ram,
          hdd,
          ports,
          location,
          applications,
          db_name: dbName,
          db_password: dbPassword,
          db_port: dbPort ? parseInt(dbPort, 10) : null,
          dump_location: dumpLocation,
          crontab_config: crontabConfig,
          backup_location: backupLocation,
          url,
          login_name: loginName,
          login_password: loginPassword,
          // --- END NEW FIELDS PAYLOAD ---
        },
        {
          headers: {
            "X-User-ID": user.user_id,
          },
        }
      );
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
        <MDBox component={Card} maxWidth="xl" mx="auto" p={3} width="100%">
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
              {/* --- FIRST ROW: Project Name, Form Name --- */}
              <Grid item xs={12} sm={6}>
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

              {/* --- SECOND ROW: Customer, Server Name --- */}
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Customer *"
                  fullWidth
                  value={customer}
                  onChange={(e) => {
                    setCustomer(e.target.value);
                    if (errors.customer) setErrors((prev) => ({ ...prev, customer: "" }));
                  }}
                  error={!!errors.customer}
                />
                {errors.customer && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.customer}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Server Name *"
                  fullWidth
                  value={serverName}
                  onChange={(e) => {
                    setServerName(e.target.value);
                    if (errors.serverName) setErrors((prev) => ({ ...prev, serverName: "" }));
                  }}
                  error={!!errors.serverName}
                />
                {errors.serverName && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.serverName}
                  </MDTypography>
                )}
              </Grid>

              {/* --- THIRD ROW: Public IP, Private IP --- */}
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Public IP (Optional)"
                  fullWidth
                  value={publicIp}
                  onChange={(e) => {
                    setPublicIp(e.target.value);
                    if (errors.publicIp) setErrors((prev) => ({ ...prev, publicIp: "" }));
                  }}
                  error={!!errors.publicIp}
                />
                {errors.publicIp && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.publicIp}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Private IP (Optional)"
                  fullWidth
                  value={privateIp}
                  onChange={(e) => {
                    setPrivateIp(e.target.value);
                    if (errors.privateIp) setErrors((prev) => ({ ...prev, privateIp: "" }));
                  }}
                  error={!!errors.privateIp}
                />
                {errors.privateIp && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.privateIp}
                  </MDTypography>
                )}
              </Grid>

              {/* --- FOURTH ROW: OS Type, Root Username --- */}
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="OS Type (Optional)"
                  fullWidth
                  value={osType}
                  onChange={(e) => setOsType(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Root Username (Optional)"
                  fullWidth
                  value={rootUsername}
                  onChange={(e) => setRootUsername(e.target.value)}
                />
              </Grid>

              {/* --- FIFTH ROW: Root Password, Server Username --- */}
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="password"
                  label="Root Password (Optional)"
                  fullWidth
                  value={rootPassword}
                  onChange={(e) => setRootPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Server Username (Optional)"
                  fullWidth
                  value={serverUsername}
                  onChange={(e) => setServerUsername(e.target.value)}
                />
              </Grid>

              {/* --- SIXTH ROW: Server Password, Core --- */}
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="password"
                  label="Server Password (Optional)"
                  fullWidth
                  value={serverPassword}
                  onChange={(e) => setServerPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="number"
                  label="Core (Optional)"
                  fullWidth
                  value={core}
                  onChange={(e) => {
                    setCore(e.target.value);
                    if (errors.core) setErrors((prev) => ({ ...prev, core: "" }));
                  }}
                  error={!!errors.core}
                />
                {errors.core && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.core}
                  </MDTypography>
                )}
              </Grid>

              {/* --- SEVENTH ROW: RAM, HDD --- */}
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="RAM (Optional)"
                  fullWidth
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="HDD (Optional)"
                  fullWidth
                  value={hdd}
                  onChange={(e) => setHdd(e.target.value)}
                />
              </Grid>

              {/* --- EIGHTH ROW: Ports, Location --- */}
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Ports (Optional)"
                  fullWidth
                  value={ports}
                  onChange={(e) => setPorts(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Location (Optional)"
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Grid>

              {/* --- NINTH ROW: Applications, DB Name --- */}
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Applications (Optional)"
                  fullWidth
                  multiline
                  rows={2}
                  value={applications}
                  onChange={(e) => setApplications(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="DB Name (Optional)"
                  fullWidth
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                />
              </Grid>

              {/* --- TENTH ROW: DB Password, DB Port --- */}
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="password"
                  label="DB Password (Optional)"
                  fullWidth
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="number"
                  label="DB Port (Optional)"
                  fullWidth
                  value={dbPort}
                  onChange={(e) => {
                    setDbPort(e.target.value);
                    if (errors.dbPort) setErrors((prev) => ({ ...prev, dbPort: "" }));
                  }}
                  error={!!errors.dbPort}
                />
                {errors.dbPort && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.dbPort}
                  </MDTypography>
                )}
              </Grid>

              {/* --- ELEVENTH ROW: Dump Location, Crontab Config --- */}
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Dump Location (Optional)"
                  fullWidth
                  value={dumpLocation}
                  onChange={(e) => setDumpLocation(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Crontab Config (Optional)"
                  fullWidth
                  multiline
                  rows={2}
                  value={crontabConfig}
                  onChange={(e) => setCrontabConfig(e.target.value)}
                />
              </Grid>

              {/* --- TWELFTH ROW: Backup Location, URL --- */}
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Backup Location (Optional)"
                  fullWidth
                  value={backupLocation}
                  onChange={(e) => setBackupLocation(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="url"
                  label="URL (Optional)"
                  fullWidth
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (errors.url) setErrors((prev) => ({ ...prev, url: "" }));
                  }}
                  error={!!errors.url}
                />
                {errors.url && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.url}
                  </MDTypography>
                )}
              </Grid>

              {/* --- THIRTEENTH ROW: Login Name, Login Password --- */}
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Login Name (Optional)"
                  fullWidth
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="password"
                  label="Login Password (Optional)"
                  fullWidth
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </Grid>

              {/* --- FOURTEENTH ROW: Dates & Status (These are removed from this form) --- */}
              {/* <Grid item xs={12} sm={6}>
                <MDInput type="date" label="Start Date *" fullWidth value={startDate} onChange={(e) => { setStartDate(e.target.value); if (errors.startDate) setErrors(prev => ({...prev, startDate: ''})); }} error={!!errors.startDate} InputLabelProps={{ shrink: true }} />
                {errors.startDate && (<MDTypography variant="caption" color="error" display="block">{errors.startDate}</MDTypography>)}
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput type="date" label="Expected Completion Date *" fullWidth value={expectedCompletionDate} onChange={(e) => { setExpectedCompletionDate(e.target.value); if (errors.expectedCompletionDate) setErrors(prev => ({...prev, expectedCompletionDate: ''})); }} error={!!errors.expectedCompletionDate} InputLabelProps={{ shrink: true }} />
                {errors.expectedCompletionDate && (<MDTypography variant="caption" color="error" display="block">{errors.expectedCompletionDate}</MDTypography>)}
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput type="date" label="Actual Completion Date (Optional)" fullWidth value={actualCompletionDate} onChange={(e) => setActualCompletionDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput select label="Status *" fullWidth value={status} onChange={(e) => { setStatus(e.target.value); if (errors.status) setErrors(prev => ({...prev, status: ''})); }} error={!!errors.status} >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </MDInput>
                {errors.status && (<MDTypography variant="caption" color="error" display="block">{errors.status}</MDTypography>)}
              </Grid> */}

              {/* --- FIFTEENTH ROW: Description & Reason for Delay (Full Width) --- */}
              {/* <Grid item xs={12}>
                <MDInput type="text" label="Reason for Delay (Optional)" fullWidth multiline rows={2} value={reasonForDelay} onChange={(e) => setReasonForDelay(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <MDInput type="text" label="Description (Optional)" fullWidth multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </Grid> */}
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
