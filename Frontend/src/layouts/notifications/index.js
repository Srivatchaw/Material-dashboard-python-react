// src/layouts/notifications/index.js

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import NotificationItem from "examples/Items/NotificationItem"; // Re-use NotificationItem

// Auth Context
import { useAuth } from "contexts/AuthContext";

function Notifications() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("error");
  const [loading, setLoading] = useState(true);

  const openSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => setSnackbarOpen(false);

  const fetchAllNotifications = async () => {
    if (!isAuthenticated || !user || !user.user_id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/notifications/get_reminders", {
        headers: {
          "X-User-ID": user.user_id,
        },
      });
      setNotifications(response.data);
    } catch (error) {
      if (error.response) {
        openSnackbar(`Error fetching notifications: ${error.response.data.message}`, "error");
      } else if (error.request) {
        openSnackbar("Error: No response from server when fetching notifications.", "error");
      } else {
        openSnackbar("An unexpected error occurred while fetching notifications.", "error");
      }
      console.error("Fetch notifications error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotifications();
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          pt={6}
          pb={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <MDTypography variant="h4" color="text">
            Loading notifications...
          </MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={3} lineHeight={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  All Notifications
                </MDTypography>
                <MDTypography variant="button" color="text">
                  Here you can see all your important reminders.
                </MDTypography>
              </MDBox>
              <Divider />
              <MDBox p={3}>
                {notifications.length === 0 ? (
                  <MDTypography variant="body2" color="text" textAlign="center">
                    No new notifications.
                  </MDTypography>
                ) : (
                  <Stack spacing={2}>
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id + notification.type} // Ensure unique key
                        icon={<Icon>password</Icon>}
                        title={notification.message}
                        date={
                          notification.date ? new Date(notification.date).toLocaleDateString() : ""
                        }
                        // Add action to navigate to the item if it's an expiry reminder
                        onClick={() => {
                          if (notification.item_id) {
                            navigate(`/items/edit/${notification.item_id}`);
                          }
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </MDBox>
            </Card>
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

export default Notifications;
