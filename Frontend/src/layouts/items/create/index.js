// src/layouts/items/create/index.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid"; // <--- Ensure Grid is imported

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

  // Existing states
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
  // --- END STATES ---

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

  // --- REGEX FOR VALIDATION ---
  const isValidIp = (ip) => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip);
  const isValidUrl = (url) => /^https?:\/\/\S+$/.test(url);
  const isPositiveNumber = (num) => !isNaN(num) && parseInt(num, 10) > 0;
  const isValidPort = (port) =>
    !isNaN(port) && parseInt(port, 10) > 0 && parseInt(port, 10) <= 65535;

  // --- Individual Field Validation Function ---
  const validateField = (fieldName, value) => {
    let errorMessage = "";

    // Required fields check (matching models.py nullable=False fields)
    switch (fieldName) {
      case "customer":
        if (!value.trim()) errorMessage = "Customer Name is required.";
        break;
      case "publicIp":
        if (!value.trim()) errorMessage = "Public IP is required.";
        break;
      case "privateIp":
        if (!value.trim()) errorMessage = "Private IP is required.";
        break;
      case "osType":
        if (!value.trim()) errorMessage = "OS Type is required.";
        break;
      case "rootUsername":
        if (!value.trim()) errorMessage = "Root Username is required.";
        break;
      case "rootPassword":
        if (!value.trim()) errorMessage = "Root Password is required.";
        break;
      case "serverUsername":
        if (!value.trim()) errorMessage = "Server Username is required.";
        break;
      case "serverPassword":
        if (!value.trim()) errorMessage = "Server Password is required.";
        break;
      case "serverName":
        if (!value.trim()) errorMessage = "Server Name is required.";
        break;
      case "core":
        if (!value.trim()) errorMessage = "Core is required.";
        break;
      case "ram":
        if (!value.trim()) errorMessage = "RAM is required.";
        break;
      case "hdd":
        if (!value.trim()) errorMessage = "HDD is required.";
        break;
      case "ports":
        if (!value.trim()) errorMessage = "Ports are required.";
        break;
      case "location":
        if (!value.trim()) errorMessage = "Location is required.";
        break;
      case "applications":
        if (!value.trim()) errorMessage = "Applications is required.";
        break;
      case "dbName":
        if (!value.trim()) errorMessage = "DB Name is required.";
        break;
      case "dbPassword":
        if (!value.trim()) errorMessage = "DB Password is required.";
        break;
      case "dbPort":
        if (!value.trim()) errorMessage = "DB Port is required.";
        break;
      case "dumpLocation":
        if (!value.trim()) errorMessage = "Dump Location is required.";
        break;
      case "crontabConfig":
        if (!value.trim()) errorMessage = "Crontab Config is required.";
        break;
      case "backupLocation":
        if (!value.trim()) errorMessage = "Backup Location is required.";
        break;
      case "url":
        if (!value.trim()) errorMessage = "URL is required.";
        break;
      case "loginName":
        if (!value.trim()) errorMessage = "Login Name is required.";
        break;
      case "loginPassword":
        if (!value.trim()) errorMessage = "Login Password is required.";
        break;
      default:
        break;
    }

    // Format checks for specific fields
    if (errorMessage === "") {
      switch (fieldName) {
        case "publicIp":
          if (value && !isValidIp(value)) errorMessage = "Invalid Public IP format.";
          break;
        case "privateIp":
          if (value && !isValidIp(value)) errorMessage = "Invalid Private IP format.";
          break;
        case "url":
          if (value && !isValidUrl(value)) errorMessage = "Invalid URL format.";
          break;
        case "core":
          if (value && !isPositiveNumber(value)) errorMessage = "Core must be a positive number.";
          break;
        case "dbPort":
          if (value && !isValidPort(value))
            errorMessage = "DB Port must be a valid port number (1-65535).";
          break;
        default:
          break;
      }
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

    const fieldsToValidate = {
      customer,
      publicIp,
      privateIp,
      osType,
      rootUsername,
      rootPassword,
      serverUsername,
      serverPassword,
      serverName,
      core,
      ram,
      hdd,
      ports,
      location,
      applications,
      dbName,
      dbPassword,
      dbPort,
      dumpLocation,
      crontabConfig,
      backupLocation,
      url,
      loginName,
      loginPassword,
    };

    for (const field in fieldsToValidate) {
      const errorMessage = validateField(field, fieldsToValidate[field]);
      if (errorMessage) {
        newErrors[field] = errorMessage;
        formIsValid = false;
      }
    }
    setErrors(newErrors);
    return formIsValid;
  };

  const handleCreateItem = async (event) => {
    event.preventDefault();

    if (!validateAllFormFields()) {
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
              {/* --- FIRST ROW: Customer, Server Name, Public IP --- */}
              <Grid item xs={12} sm={4}>
                {" "}
                {/* Changed sm from 6 to 4 */}
                <MDInput
                  type="text"
                  label="Customer *"
                  fullWidth
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  onBlur={(e) => handleBlur("customer", e.target.value)}
                  error={!!errors.customer}
                />
                {errors.customer && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.customer}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {" "}
                {/* Changed sm from 6 to 4 */}
                <MDInput
                  type="text"
                  label="Server Name *"
                  fullWidth
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  onBlur={(e) => handleBlur("serverName", e.target.value)}
                  error={!!errors.serverName}
                />
                {errors.serverName && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.serverName}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {" "}
                {/* Changed sm from 6 to 4 */}
                <MDInput
                  type="text"
                  label="Public IP *"
                  fullWidth
                  value={publicIp}
                  onChange={(e) => setPublicIp(e.target.value)}
                  onBlur={(e) => handleBlur("publicIp", e.target.value)}
                  error={!!errors.publicIp}
                />
                {errors.publicIp && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.publicIp}
                  </MDTypography>
                )}
              </Grid>

              {/* --- SECOND ROW: Private IP, OS Type, Root Username --- */}
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="text"
                  label="Private IP *"
                  fullWidth
                  value={privateIp}
                  onChange={(e) => setPrivateIp(e.target.value)}
                  onBlur={(e) => handleBlur("privateIp", e.target.value)}
                  error={!!errors.privateIp}
                />
                {errors.privateIp && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.privateIp}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  select
                  label="OS Type *"
                  fullWidth
                  value={osType}
                  onChange={(e) => {
                    setOsType(e.target.value);
                    handleBlur("osType", e.target.value);
                  }}
                  error={!!errors.osType}
                >
                  <MenuItem value="">-- Select OS Type --</MenuItem>
                  <MenuItem value="Linux">Linux</MenuItem>
                  <MenuItem value="Windows">Windows</MenuItem>
                  <MenuItem value="Ubuntu">Ubuntu</MenuItem>
                  <MenuItem value="MacOS">MacOS</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </MDInput>
                {errors.osType && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.osType}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="text"
                  label="Root Username *"
                  fullWidth
                  value={rootUsername}
                  onChange={(e) => setRootUsername(e.target.value)}
                  onBlur={(e) => handleBlur("rootUsername", e.target.value)}
                  error={!!errors.rootUsername}
                />
                {errors.rootUsername && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.rootUsername}
                  </MDTypography>
                )}
              </Grid>

              {/* --- THIRD ROW: Root Password, Server Username, Server Password --- */}
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="password"
                  label="Root Password *"
                  fullWidth
                  value={rootPassword}
                  onChange={(e) => setRootPassword(e.target.value)}
                  onBlur={(e) => handleBlur("rootPassword", e.target.value)}
                  error={!!errors.rootPassword}
                />
                {errors.rootPassword && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.rootPassword}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="text"
                  label="Server Username *"
                  fullWidth
                  value={serverUsername}
                  onChange={(e) => setServerUsername(e.target.value)}
                  onBlur={(e) => handleBlur("serverUsername", e.target.value)}
                  error={!!errors.serverUsername}
                />
                {errors.serverUsername && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.serverUsername}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="password"
                  label="Server Password *"
                  fullWidth
                  value={serverPassword}
                  onChange={(e) => setServerPassword(e.target.value)}
                  onBlur={(e) => handleBlur("serverPassword", e.target.value)}
                  error={!!errors.serverPassword}
                />
                {errors.serverPassword && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.serverPassword}
                  </MDTypography>
                )}
              </Grid>

              {/* --- FOURTH ROW: Core, RAM, HDD --- */}
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="number"
                  label="Core *"
                  fullWidth
                  value={core}
                  onChange={(e) => setCore(e.target.value)}
                  onBlur={(e) => handleBlur("core", e.target.value)}
                  error={!!errors.core}
                />
                {errors.core && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.core}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="text"
                  label="RAM *"
                  fullWidth
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  onBlur={(e) => handleBlur("ram", e.target.value)}
                  error={!!errors.ram}
                />
                {errors.ram && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.ram}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="text"
                  label="HDD *"
                  fullWidth
                  value={hdd}
                  onChange={(e) => setHdd(e.target.value)}
                  onBlur={(e) => handleBlur("hdd", e.target.value)}
                  error={!!errors.hdd}
                />
                {errors.hdd && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.hdd}
                  </MDTypography>
                )}
              </Grid>

              {/* --- FIFTH ROW: Ports, Location, Applications --- */}
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="text"
                  label="Ports *"
                  fullWidth
                  value={ports}
                  onChange={(e) => setPorts(e.target.value)}
                  onBlur={(e) => handleBlur("ports", e.target.value)}
                  error={!!errors.ports}
                />
                {errors.ports && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.ports}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="text"
                  label="Location *"
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onBlur={(e) => handleBlur("location", e.target.value)}
                  error={!!errors.location}
                />
                {errors.location && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.location}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="text"
                  label="Applications *"
                  fullWidth
                  multiline
                  rows={2}
                  value={applications}
                  onChange={(e) => setApplications(e.target.value)}
                  onBlur={(e) => handleBlur("applications", e.target.value)}
                  error={!!errors.applications}
                />
                {errors.applications && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.applications}
                  </MDTypography>
                )}
              </Grid>

              {/* --- SIXTH ROW: DB Name, DB Password, DB Port --- */}
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="text"
                  label="DB Name *"
                  fullWidth
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  onBlur={(e) => handleBlur("dbName", e.target.value)}
                  error={!!errors.dbName}
                />
                {errors.dbName && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.dbName}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="password"
                  label="DB Password *"
                  fullWidth
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                  onBlur={(e) => handleBlur("dbPassword", e.target.value)}
                  error={!!errors.dbPassword}
                />
                {errors.dbPassword && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.dbPassword}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="number"
                  label="DB Port *"
                  fullWidth
                  value={dbPort}
                  onChange={(e) => setDbPort(e.target.value)}
                  onBlur={(e) => handleBlur("dbPort", e.target.value)}
                  error={!!errors.dbPort}
                />
                {errors.dbPort && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.dbPort}
                  </MDTypography>
                )}
              </Grid>

              {/* --- SEVENTH ROW: Dump Location, Crontab Config, Backup Location --- */}
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="text"
                  label="Dump Location *"
                  fullWidth
                  value={dumpLocation}
                  onChange={(e) => setDumpLocation(e.target.value)}
                  onBlur={(e) => handleBlur("dumpLocation", e.target.value)}
                  error={!!errors.dumpLocation}
                />
                {errors.dumpLocation && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.dumpLocation}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="text"
                  label="Crontab Config *"
                  fullWidth
                  multiline
                  rows={2}
                  value={crontabConfig}
                  onChange={(e) => setCrontabConfig(e.target.value)}
                  onBlur={(e) => handleBlur("crontabConfig", e.target.value)}
                  error={!!errors.crontabConfig}
                />
                {errors.crontabConfig && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.crontabConfig}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="text"
                  label="Backup Location *"
                  fullWidth
                  value={backupLocation}
                  onChange={(e) => setBackupLocation(e.target.value)}
                  onBlur={(e) => handleBlur("backupLocation", e.target.value)}
                  error={!!errors.backupLocation}
                />
                {errors.backupLocation && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.backupLocation}
                  </MDTypography>
                )}
              </Grid>

              {/* --- EIGHTH ROW: URL, Login Name, Login Password --- */}
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="url"
                  label="URL *"
                  fullWidth
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={(e) => handleBlur("url", e.target.value)}
                  error={!!errors.url}
                />
                {errors.url && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.url}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="text"
                  label="Login Name *"
                  fullWidth
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  onBlur={(e) => handleBlur("loginName", e.target.value)}
                  error={!!errors.loginName}
                />
                {errors.loginName && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.loginName}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  type="password"
                  label="Login Password *"
                  fullWidth
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onBlur={(e) => handleBlur("loginPassword", e.target.value)}
                  error={!!errors.loginPassword}
                />
                {errors.loginPassword && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.loginPassword}
                  </MDTypography>
                )}
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

CreateItem.propTypes = {
  // Add propTypes here if CreateItem is expected to receive props
};

export default CreateItem;
