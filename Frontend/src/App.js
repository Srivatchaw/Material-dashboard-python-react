import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
// import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
// import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import getRoutes from "routes"; // Ensure this imports as `getRoutes`

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

// Auth Context
import { useAuth } from "contexts/AuthContext";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  const { isAuthenticated, logout } = useAuth(); // Get isAuthenticated state and logout from AuthContext

  // Call getRoutes directly at the top level of the App component,
  // passing the necessary props (isAuthenticated, logout).
  const routes = useMemo(() => getRoutes(isAuthenticated, logout), [isAuthenticated, logout]);

  // Cache for the rtl (if you are using RTL layout)
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave from mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Render all routes dynamically
  const getRoutesComponent = (allRoutes) =>
    allRoutes
      .map((route) => {
        // If the route has sub-routes (collapse), render them recursively
        if (route.collapse) {
          // Flatten any nested routes from collapsible items
          return getRoutesComponent(route.collapse);
        }
        // If it's a direct route with a component
        if (route.route && route.component) {
          return <Route exact path={route.route} element={route.component} key={route.key} />;
        }
        return null;
      })
      .flat(Infinity); // Use flat(Infinity) to handle any depth of nested routes

  // Define configsButton here inside the App component, before it's used in the return statement
  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && ( // Only show Sidenav and Configurator for dashboard layout
        <>
          <Sidenav
            color={sidenavColor}
            brand={
              (darkMode && !transparentSidenav && whiteSidenav) ||
              (!darkMode && !whiteSidenav && transparentSidenav)
                ? brandDark
                : brandWhite
            }
            brandName="Material Dashboard 2"
            routes={routes} // Pass the dynamic routes generated by getRoutes
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}

      <Routes>
        {getRoutesComponent(routes)} {/* Render all routes from the dynamic list */}
      </Routes>
    </ThemeProvider>
  );
}
