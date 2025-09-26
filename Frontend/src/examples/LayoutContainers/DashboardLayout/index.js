import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// @mui material components
import Box from "@mui/material/Box";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
// import DashboardNavbar from "examples/Navbars/DashboardNavbar"; // <--- REMOVE THIS IMPORT

// Material Dashboard 2 React context
import { useMaterialUIController, setMiniSidenav } from "context";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  // const { miniSidenav } = controller; // miniSidenav is not controlled by this component directly now
  const { pathname } = useLocation();

  useEffect(() => {
    // setMiniSidenav(dispatch, false); // No longer needed
  }, [dispatch, pathname]);

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",

        // --- REMOVED SIDENAV-RELATED MARGIN STYLING ---
        // [breakpoints.up("xl")]: {
        //   marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
        //   transition: transitions.create(["margin-left", "margin-right"], {
        //     easing: transitions.easing.easeInOut,
        //     duration: transitions.duration.standard,
        //   }),
        // },

        // Removed paddingTop as Navbar is also removed. Adjust if you need global spacing.
        // paddingTop: pxToRem(70),
      })}
    >
      {/* <DashboardNavbar /> */} {/* <--- REMOVE OR COMMENT OUT THIS LINE */}
      {children}
    </MDBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
