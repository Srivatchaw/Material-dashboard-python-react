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
// import Sidenav from "examples/Sidenav"; // Sidenav is intentionally removed in the previous step
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import getRoutes from "routes";

// Material Dashboard 2 React contexts
import {
  useMaterialUIController,
  setMiniSidenav,
  setOpenConfigurator,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

// Images (Your custom logo import)
import myCustomLogo from "assets/images/1631340580623.jpg";

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

  const { isAuthenticated, logout } = useAuth();

  const routes = useMemo(() => getRoutes(isAuthenticated, logout), [isAuthenticated, logout]);

  // Cache for the rtl (if you are using RTL layout)
  useMemo(() => {
    const emotionCache = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(emotionCache);
  }, []);

  // Sidenav handlers are no longer directly used if Sidenav is removed from App.js JSX
  const handleOnMouseEnter = () => {
    // if (miniSidenav && !onMouseEnter) {
    //   setMiniSidenav(dispatch, false);
    //   setOnMouseEnter(true);
    // }
  };

  const handleOnMouseLeave = () => {
    // if (onMouseEnter) {
    //   setMiniSidenav(dispatch, true);
    //   setOnMouseEnter(false);
    // }
  };

  const handleConfiguratorOpen = () => {
    setOpenConfigurator(dispatch, !openConfigurator);
  };

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Sidenav resize effect is no longer directly needed in App.js if Sidenav component is removed
  // useEffect(() => {
  //   function handleMiniSidenavOnResize() {
  //     setMiniSidenav(dispatch, window.innerWidth < 1200);
  //     setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
  //     setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
  //   }
  //   window.addEventListener("resize", handleMiniSidenavOnResize);
  //   handleMiniSidenavOnResize(); // Call on mount
  //   return () => window.removeEventListener("resize", handleMiniSidenavOnResize);
  // }, [dispatch, transparentSidenav, whiteSidenav]);

  // --- RESTORED: getRoutesComponent function definition ---
  // This function is needed to render the Route components for React Router
  const getRoutesComponent = (allRoutes) =>
    allRoutes
      .map((route) => {
        if (route.collapse) {
          return getRoutesComponent(route.collapse);
        }
        if (route.route && route.component) {
          return <Route exact path={route.route} element={route.component} key={route.key} />;
        }
        return null;
      })
      .flat(Infinity);
  // --- END RESTORED ---

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
      {layout === "dashboard" && (
        <>
          {/* <Sidenav // Sidenav component is intentionally removed from here
            color={sidenavColor}
            brand={myCustomLogo}
            brandName="Paragon Dynamics"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          /> */}
          <Configurator openConfigurator={openConfigurator} />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}

      <Routes>{getRoutesComponent(routes)}</Routes>
    </ThemeProvider>
  );
}
