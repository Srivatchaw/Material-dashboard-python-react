/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import React, { useState, useEffect } from "react"; // <--- Add React
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
import Badge from "@mui/material/Badge"; // <--- Add Badge

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
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
  // setSidenavColor, // <--- This setter is for Sidenav colors, not used in this navbar
} from "context";

// Auth Context
import { useAuth } from "contexts/AuthContext";
import axios from "axios";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller; // <--- Removed sidenavColor from here, as it's not used directly here
  const [openMenu, setOpenMenu] = useState(false);
  const pathSegments = useLocation().pathname.split("/").filter(Boolean);

  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

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
  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };
  const handleCloseMenu = () => setOpenMenu(false);

  const handleLogoutClick = () => {
    logout();
    handleCloseMenu();
    navigate("/authentication/sign-in");
  };

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      {notifications.length === 0 ? (
        <MenuItem onClick={handleCloseMenu}>No new reminders</MenuItem>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id + notification.type}
            icon={<Icon>password</Icon>}
            title={notification.message}
            onClick={() => {
              handleCloseMenu();
              if (notification.item_id) {
                navigate(`/items/edit/${notification.item_id}`);
              }
            }}
          />
        ))
      )}
    </Menu>
  );

  // Styles for the navbar icons
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
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs
            icon="home"
            title={
              pathSegments.length > 0
                ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() +
                  pathSegments[pathSegments.length - 1].slice(1)
                : "Dashboard"
            }
            route={useLocation().pathname}
            light={light}
          />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <Link to="/dashboard">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>dashboard</Icon>
                  <MDTypography variant="button" fontWeight="medium" sx={iconsStyle}>
                    Dashboard
                  </MDTypography>
                </IconButton>
              </Link>
              <Link to="/profile">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>person</Icon>
                  <MDTypography variant="button" fontWeight="medium" sx={iconsStyle}>
                    Profile
                  </MDTypography>
                </IconButton>
              </Link>
              {isAuthenticated ? (
                <IconButton
                  sx={navbarIconButton}
                  size="small"
                  disableRipple
                  onClick={handleLogoutClick}
                >
                  <Icon sx={iconsStyle}>logout</Icon>
                  <MDTypography variant="button" fontWeight="medium" sx={iconsStyle}>
                    Logout
                  </MDTypography>
                </IconButton>
              ) : (
                <Link to="/authentication/sign-in">
                  <IconButton sx={navbarIconButton} size="small" disableRipple>
                    <Icon sx={iconsStyle}>login</Icon>
                    <MDTypography variant="button" fontWeight="medium" sx={iconsStyle}>
                      Sign In
                    </MDTypography>
                  </IconButton>
                </Link>
              )}

              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>

              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Badge badgeContent={notificationCount} color="error" variant="dot">
                  <Icon sx={iconsStyle}>notifications</Icon>
                </Badge>
              </IconButton>
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
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
