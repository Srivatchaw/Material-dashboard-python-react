import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import Badge from "@mui/material/Badge";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
// import Breadcrumbs from "examples/Breadcrumbs"; // <--- REMOVE THIS IMPORT
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Auth Context
import { useAuth } from "contexts/AuthContext";
import axios from "axios";

// Image import for logo
import myCustomLogo from "assets/images/1631340580623.jpg";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotificationMenu, setOpenNotificationMenu] = useState(false);

  const pathSegments = useLocation().pathname.split("/").filter(Boolean); // Still needed for path-based logic in title

  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    if (showSearchInput) {
      setSearchTerm("");
    }
  };

  const fetchPasswordReminders = async () => {
    if (!isAuthenticated || !user || !user.user_id) return;
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/notifications/get_reminders", {
        headers: {
          "X-User-ID": user.user_id,
        },
      });
      setNotifications(response.data);
      setNotificationCount(response.data.length);
    } catch (error) {
      console.error("Error fetching password reminders:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchPasswordReminders();
    } else {
      setNotificationCount(0);
      setNotifications([]);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  const handleOpenUserMenu = (event) => setOpenUserMenu(event.currentTarget);
  const handleCloseUserMenu = () => setOpenUserMenu(false);

  const handleOpenNotificationMenu = (event) => setOpenNotificationMenu(event.currentTarget);
  const handleCloseNotificationMenu = () => setOpenNotificationMenu(false);

  const handleLogoutClick = () => {
    logout();
    handleCloseUserMenu();
    navigate("/authentication/sign-in");
  };

  const renderNotificationMenu = () => (
    <Menu
      anchorEl={openNotificationMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={Boolean(openNotificationMenu)}
      onClose={handleCloseNotificationMenu}
      sx={{ mt: 2 }}
    >
      {notifications.length === 0 ? (
        <MenuItem onClick={handleCloseNotificationMenu}>No new reminders</MenuItem>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id + notification.type}
            icon={<Icon>password</Icon>}
            title={notification.message}
            onClick={() => {
              handleCloseNotificationMenu();
              if (notification.item_id) {
                navigate(`/items/edit/${notification.item_id}`);
              }
            }}
          />
        ))
      )}
    </Menu>
  );

  const renderUserMenu = () => (
    <Menu
      anchorEl={openUserMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(openUserMenu)}
      onClose={handleCloseUserMenu}
      sx={{ mt: 2 }}
    >
      {/* {isAuthenticated && (
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            navigate("/dashboard");
          }}
        >
          <Icon sx={{ mr: 1 }}>dashboard</Icon>
          <MDTypography variant="button" fontWeight="medium">
            Dashboard
          </MDTypography>
        </MenuItem>
      )} */}
      {/* {isAuthenticated && (
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            navigate("/tables");
          }}
        >
          <Icon sx={{ mr: 1 }}>table_view</Icon>
          <MDTypography variant="button" fontWeight="medium">
            Tables
          </MDTypography>
        </MenuItem>
      )} */}
      {isAuthenticated && (
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            navigate("/notifications");
          }}
        >
          <Badge badgeContent={notificationCount} color="error" variant="dot" sx={{ mr: 1 }}>
            <Icon>notifications</Icon>
          </Badge>
          <MDTypography variant="button" fontWeight="medium">
            Notifications
          </MDTypography>
        </MenuItem>
      )}
      {isAuthenticated && (
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            navigate("/profile");
          }}
        >
          <Icon sx={{ mr: 1 }}>person</Icon>
          <MDTypography variant="button" fontWeight="medium">
            Profile
          </MDTypography>
        </MenuItem>
      )}
      {isAuthenticated && (
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            handleConfiguratorOpen();
          }}
        >
          <Icon sx={{ mr: 1 }}>settings</Icon>
          <MDTypography variant="button" fontWeight="medium">
            Settings
          </MDTypography>
        </MenuItem>
      )}

      <Divider sx={{ my: 0.5 }} />

      {isAuthenticated ? (
        <MenuItem onClick={handleLogoutClick}>
          <Icon sx={{ mr: 1 }}>logout</Icon>
          <MDTypography variant="button" fontWeight="medium">
            Logout
          </MDTypography>
        </MenuItem>
      ) : (
        <>
          <MenuItem
            onClick={() => {
              handleCloseUserMenu();
              navigate("/authentication/sign-in");
            }}
          >
            <Icon sx={{ mr: 1 }}>login</Icon>
            <MDTypography variant="button" fontWeight="medium">
              Sign In
            </MDTypography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCloseUserMenu();
              navigate("/authentication/sign-up");
            }}
          >
            <Icon sx={{ mr: 1 }}>assignment</Icon>
            <MDTypography variant="button" fontWeight="medium">
              Sign Up
            </MDTypography>
          </MenuItem>
        </>
      )}
    </Menu>
  );

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute: fixedNavbar, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        {/* --- Brand Name/Logo --- */}
        <MDBox component={Link} to="/" display="flex" alignItems="center" mr={2}>
          {/* ADD YOUR IMAGE ICON HERE */}
          <MDBox component="img" src={myCustomLogo} alt="Brand" width="2rem" mr={1} />
          <MDTypography variant="h6" fontWeight="medium" color={darkMode ? "white" : "dark"}>
            Paragon Dynamics
          </MDTypography>
        </MDBox>

        {/* --- REMOVED BREADCRUMBS --- */}
        {/* <MDBox color="inherit" mb={{ xs: 1, md: 0 }}>
          <Breadcrumbs 
            icon="home" 
            title={pathSegments.length > 0 ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() + pathSegments[pathSegments.length - 1].slice(1) : "Dashboard"} 
            route={useLocation().pathname} 
            light={light} 
          />
        </MDBox> */}

        <MDBox ml="auto" sx={{ display: "flex", alignItems: "center" }}>
          {/* --- SEARCH ICON AND CONDITIONAL INPUT --- */}
          {showSearchInput ? (
            <MDBox pr={1}>
              <MDInput
                type="text"
                label="Search here..."
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleToggleSearchInput} size="small">
                        <Icon>close</Icon>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
          ) : (
            <IconButton
              size="small"
              disableRipple
              color="inherit"
              sx={navbarIconButton}
              onClick={handleToggleSearchInput}
            >
              <Icon sx={iconsStyle}>search</Icon>
            </IconButton>
          )}
          {/* --- END SEARCH --- */}

          <MDBox color={light ? "white" : "inherit"} display="flex" alignItems="center">
            {/* --- REGULAR NAVBAR LINKS (always visible if not mini) --- */}
            {isAuthenticated && (
              <>
                {" "}
                {/* Group these links for conditional rendering */}
                <Link to="/dashboard">
                  <IconButton sx={navbarIconButton} size="small" disableRipple>
                    <Icon sx={iconsStyle}>dashboard</Icon>
                    <MDTypography variant="button" fontWeight="medium" sx={iconsStyle}>
                      Dashboard
                    </MDTypography>
                  </IconButton>
                </Link>
                <Link to="/tables">
                  <IconButton sx={navbarIconButton} size="small" disableRipple>
                    <Icon sx={iconsStyle}>table_view</Icon>
                    <MDTypography variant="button" fontWeight="medium" sx={iconsStyle}>
                      Tables
                    </MDTypography>
                  </IconButton>
                </Link>
              </>
            )}

            {/* --- USER ACTIONS DROPDOWN TRIGGER (Settings, Logout/SignIn/SignUp) --- */}
            <IconButton
              size="small"
              disableRipple
              color="inherit"
              sx={navbarIconButton}
              aria-controls="user-menu"
              aria-haspopup="true"
              variant="contained"
              onClick={handleOpenUserMenu}
            >
              <Icon sx={iconsStyle}>menu</Icon> {/* Changed to 'menu' icon */}
            </IconButton>
            {renderUserMenu()}

            {/* Notification Bell Icon (now just a trigger for notification menu) */}
            <IconButton
              size="small"
              disableRipple
              color="inherit"
              sx={navbarIconButton}
              aria-controls="notification-menu"
              aria-haspopup="true"
              variant="contained"
              onClick={handleOpenNotificationMenu}
            >
              <Badge badgeContent={notificationCount} color="error" variant="dot">
                <Icon sx={iconsStyle}>notifications</Icon>
              </Badge>
            </IconButton>
            {renderNotificationMenu()}
          </MDBox>
        </MDBox>
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
