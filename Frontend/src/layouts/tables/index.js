// src/layouts/tables/index.js

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Auth Context
import { useAuth } from "contexts/AuthContext";

function Tables() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("error");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const openSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => setSnackbarOpen(false);

  const fetchItems = async () => {
    if (!user || !user.user_id) {
      openSnackbar("User not authenticated. Please sign in.", "error");
      navigate("/authentication/sign-in");
      return;
    }
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/items/get_all", {
        headers: {
          "X-User-ID": user.user_id,
        },
      });
      setItems(response.data);
    } catch (error) {
      if (error.response) {
        openSnackbar(`Error fetching items: ${error.response.data.message}`, "error");
      } else if (error.request) {
        openSnackbar("Error: No response from server when fetching items.", "error");
      } else {
        openSnackbar("An unexpected error occurred while fetching items.", "error");
      }
      console.error("Fetch items error:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  const handleAddItem = () => {
    navigate("/items/create");
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || !user || !user.user_id) return;

    try {
      await axios.delete(`http://127.0.0.1:5000/api/items/delete/${itemToDelete.id}`, {
        headers: {
          "X-User-ID": user.user_id,
        },
      });
      openSnackbar("Item deleted successfully!", "success");
      fetchItems(); // Refresh the list after deletion
    } catch (error) {
      if (error.response) {
        openSnackbar(`Error deleting item: ${error.response.data.message}`, "error");
      } else if (error.request) {
        openSnackbar("Error: No response from server when deleting item.", "error");
      } else {
        openSnackbar("An unexpected error occurred while deleting item.", "error");
      }
      console.error("Delete item error:", error);
    } finally {
      setOpenDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  const handleEditClick = (item) => {
    navigate(`/items/edit/${item.id}`); // Navigate to edit page with item ID
  };

  // --- Filtered Items Logic ---
  const filteredItems = items.filter((item) => {
    if (!searchTerm) return true;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return (
      (item.customer && item.customer.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.server_name && item.server_name.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.public_ip && item.public_ip.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.private_ip && item.private_ip.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.os_type && item.os_type.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.root_username && item.root_username.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.server_username && item.server_username.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.location && item.location.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.applications && item.applications.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.db_name && item.db_name.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.url && item.url.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.login_name && item.login_name.toLowerCase().includes(lowerCaseSearchTerm))
    );
  });
  // --- END Filtered Items Logic ---

  const renderItemsTable = () => (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDTypography variant="h6" fontWeight="medium">
          My Items
        </MDTypography>
        <MDBox display="flex" alignItems="center">
          <MDBox mr={2}>
            <MDInput
              type="text"
              label="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>search</Icon>
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm("")} size="small">
                      <Icon>close</Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </MDBox>
          <MDButton variant="gradient" color="info" onClick={handleAddItem}>
            <Icon>add</Icon>&nbsp;Add Item
          </MDButton>
        </MDBox>
      </MDBox>
      <MDBox pt={3} sx={{ overflowX: "auto" }}>
        {filteredItems.length === 0 && searchTerm === "" ? (
          <MDTypography variant="body2" color="text" textAlign="center" p={2}>
            No items found. Click &quot;Add Item&quot; to create one.
          </MDTypography>
        ) : filteredItems.length === 0 && searchTerm !== "" ? (
          <MDTypography variant="body2" color="text" textAlign="center" p={2}>
            No items match your search term &quot;{searchTerm}&quot;.
          </MDTypography>
        ) : (
          <MDBox
            component="table"
            width="100%"
            sx={{ "& .MuiTableRow-root:not(:last-child)": { "& td": { borderBottom: 0 } } }}
          >
            <thead>
              <MDBox component="tr" bgColor="light" textAlign="left">
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Customer
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Server Name
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Public IP
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Private IP
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    OS Type
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Root Username
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Server User
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Core
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    RAM
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    HDD
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Ports
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Location
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Applications
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    DB Name
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    DB Port
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Dump Location
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Crontab Config
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Backup Location
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    URL
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Login Name
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    DB Pwd Set At
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Created At
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} px={3}>
                  <MDTypography variant="overline" fontWeight="bold">
                    Actions
                  </MDTypography>
                </MDBox>
              </MDBox>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <MDBox component="tr" key={item.id}>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.customer}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.server_name}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.public_ip || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.private_ip || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.os_type || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.root_username || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.server_username || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.core || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.ram || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.hdd || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.ports || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.location || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.applications || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.db_name || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.db_port || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.dump_location || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.crontab_config || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.backup_location || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.url || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.login_name || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.login_password ? "********" : "N/A"} {/* Hide password */}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {item.db_password_set_at
                        ? new Date(item.db_password_set_at).toLocaleDateString()
                        : "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDTypography variant="button" fontWeight="regular">
                      {new Date(item.created_at).toLocaleDateString()}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" p={1.5} px={3}>
                    <MDButton
                      variant="text"
                      color="dark"
                      onClick={() => handleEditClick(item)}
                      sx={{ mr: 1 }}
                    >
                      <Icon>edit</Icon>&nbsp;Edit
                    </MDButton>
                    <MDButton variant="text" color="error" onClick={() => handleDeleteClick(item)}>
                      <Icon>delete</Icon>&nbsp;Delete
                    </MDButton>
                  </MDBox>
                </MDBox>
              ))}
            </tbody>
          </MDBox>
        )}
      </MDBox>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the item &quot;
            {itemToDelete ? itemToDelete.server_name : ""}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpenDeleteDialog(false)} color="dark">
            Cancel
          </MDButton>
          <MDButton onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>
    </Card>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {renderItemsTable()}
          </Grid>
        </Grid>
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

export default Tables;
