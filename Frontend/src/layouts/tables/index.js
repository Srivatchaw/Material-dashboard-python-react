import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog"; // For delete confirmation
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete dialog
  const [itemToDelete, setItemToDelete] = useState(null); // State to store item to be deleted

  const openSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => setSnackbarOpen(false);

  const fetchItems = async () => {
    if (!user || !user.user_id) {
      openSnackbar("User not authenticated. Please sign in.", "error");
      navigate("/authentication/sign-in"); // Redirect if not authenticated
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

  const renderItemsTable = () => (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDTypography variant="h6" fontWeight="medium">
          My Items
        </MDTypography>
        <MDButton variant="gradient" color="info" onClick={handleAddItem}>
          <Icon>add</Icon>&nbsp;Add Item
        </MDButton>
      </MDBox>
      <MDBox pt={3}>
        {items.length === 0 ? (
          <MDTypography variant="body2" color="text" textAlign="center" p={2}>
            No items found. Click &quot;Add Item&quot; to create one.
          </MDTypography>
        ) : (
          <MDBox sx={{ "& .MuiTableRow-root:not(:last-child)": { "& td": { borderBottom: 0 } } }}>
            <MDBox component="table" width="100%">
              <thead>
                <MDBox component="tr" bgColor="light" textAlign="left">
                  <MDBox component="th" py={1.5} px={3}>
                    <MDTypography variant="overline" fontWeight="bold">
                      Project Name
                    </MDTypography>{" "}
                    {/* Changed from Name */}
                  </MDBox>
                  <MDBox component="th" py={1.5} px={3}>
                    <MDTypography variant="overline" fontWeight="bold">
                      Form Name
                    </MDTypography>{" "}
                    {/* NEW FIELD */}
                  </MDBox>
                  <MDBox component="th" py={1.5} px={3}>
                    <MDTypography variant="overline" fontWeight="bold">
                      Start Date
                    </MDTypography>{" "}
                    {/* NEW FIELD */}
                  </MDBox>
                  <MDBox component="th" py={1.5} px={3}>
                    <MDTypography variant="overline" fontWeight="bold">
                      Exp. Completion
                    </MDTypography>{" "}
                    {/* NEW FIELD */}
                  </MDBox>
                  <MDBox component="th" py={1.5} px={3}>
                    <MDTypography variant="overline" fontWeight="bold">
                      Status
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
                {items.map((item) => (
                  <MDBox component="tr" key={item.id}>
                    <MDBox component="td" p={1.5} px={3}>
                      <MDTypography variant="button" fontWeight="regular">
                        {item.project_name} {/* Changed from item.name */}
                      </MDTypography>
                    </MDBox>
                    <MDBox component="td" p={1.5} px={3}>
                      <MDTypography variant="button" fontWeight="regular">
                        {item.form_name} {/* NEW FIELD */}
                      </MDTypography>
                    </MDBox>
                    <MDBox component="td" p={1.5} px={3}>
                      <MDTypography variant="button" fontWeight="regular">
                        {item.start_date} {/* NEW FIELD */}
                      </MDTypography>
                    </MDBox>
                    <MDBox component="td" p={1.5} px={3}>
                      <MDTypography variant="button" fontWeight="regular">
                        {item.expected_completion_date} {/* NEW FIELD */}
                      </MDTypography>
                    </MDBox>
                    <MDBox component="td" p={1.5} px={3}>
                      <MDTypography variant="button" fontWeight="regular">
                        {item.status}
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
                      <MDButton
                        variant="text"
                        color="error"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Icon>delete</Icon>&nbsp;Delete
                      </MDButton>
                    </MDBox>
                  </MDBox>
                ))}
              </tbody>
            </MDBox>
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
            Are you sure you want to delete the item &quot;{itemToDelete ? itemToDelete.name : ""}
            &quot;? This action cannot be undone. {/* <--- CORRECTED LINE */}
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
