import React, { useState, useEffect } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
// import InputAdornment from "@mui/material/InputAdornment"; // <--- REMOVE THIS IMPORT
// import IconButton from "@mui/material/IconButton"; // <--- REMOVE THIS IMPORT

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// import MDInput from "components/MDInput"; // <--- REMOVE THIS IMPORT

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

// Auth Context
import { useAuth } from "contexts/AuthContext";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const collapseName = location.pathname.replace("/", "");

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  // --- REMOVED SEARCH-RELATED STATES AND HANDLERS ---
  // const [showSearchInput, setShowSearchInput] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  // const handleToggleSearchInput = () => { /* ... */ };
  // --- END REMOVED SEARCH ---

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();

    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, transparentSidenav, whiteSidenav]);

  const handleLogoutClick = () => {
    logout();
    navigate("/authentication/sign-in");
  };

  const renderRoutes = routes.map(
    ({ type, name, icon, title, noCollapse, key, href, route, onClick }) => {
      let returnValue;

      if (type === "collapse") {
        if (key === "logout" && isAuthenticated) {
          returnValue = (
            <Link
              href={route}
              key={key}
              onClick={(e) => {
                e.preventDefault();
                handleLogoutClick();
              }}
              sx={{ textDecoration: "none" }}
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            </Link>
          );
        } else if ((key === "sign-in" || key === "sign-up") && !isAuthenticated) {
          returnValue = (
            <NavLink key={key} to={route}>
              <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
            </NavLink>
          );
        } else if (isAuthenticated && key !== "sign-in" && key !== "sign-up" && key !== "logout") {
          returnValue = (
            <NavLink key={key} to={route}>
              <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
            </NavLink>
          );
        } else if (href) {
          returnValue = (
            <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            </Link>
          );
        }
      } else if (type === "route") {
        if (key === "create-item" && isAuthenticated) {
          returnValue = (
            <NavLink key={key} to={route}>
              <SidenavCollapse name={name} icon={<Icon>add</Icon>} active={key === collapseName} />
            </NavLink>
          );
        }
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            color={color}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }

      return returnValue;
    }
  );

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={color}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />

      {/* --- REMOVED SEARCH ICON AND CONDITIONAL INPUT --- */}
      {/* <MDBox px={3} pt={2} pb={1}>
        <MDBox display="flex" alignItems="center" justifyContent={showSearchInput ? "flex-start" : "flex-end"}>
          {!showSearchInput && (
            <IconButton sx={{ cursor: "pointer" }} onClick={handleToggleSearchInput}>
              <Icon>search</Icon>
            </IconButton>
          )}
          {showSearchInput && (
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
          )}
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      /> */}
      {/* --- END REMOVED SEARCH --- */}

      <List>{renderRoutes}</List>

      {isAuthenticated && user && (
        <MDBox p={2} mt="auto" textAlign="center">
          <MDTypography variant="caption" color="text" fontWeight="medium" display="block">
            Logged in as: {user.username}
          </MDTypography>
        </MDBox>
      )}
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
