import PropTypes from "prop-types"; // Ensure this is imported
import { Link } from "react-router-dom"; // If DefaultNavbar uses Link

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DefaultNavbar from "examples/Navbars/DefaultNavbar"; // Check if this is imported

// Material Dashboard 2 React themes
import colors from "assets/theme/base/colors"; // If colors are used
import typography from "assets/theme/base/typography"; // If typography is used

// Hooks
// import { useMaterialUIController } from "context"; // If using context directly here

function CoverLayout({ image, children }) {
  // Ensure 'children' is destructured
  const { light } = colors; // Example: if you need color values
  const { h4 } = typography; // Example: if you need typography values

  // Assuming your DefaultNavbar might need routes or actions
  const navbarRoutes = [
    { name: "Dashboard", route: "/dashboard", icon: <Icon>dashboard</Icon> },
    { name: "Sign Up", route: "/authentication/sign-up", icon: <Icon>assignment</Icon> },
    { name: "Sign In", route: "/authentication/sign-in", icon: <Icon>login</Icon> },
  ]; // This is an example, use your actual navbar routes

  return (
    <MDBox
      sx={{
        backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
          image &&
          `${linearGradient(
            rgba(gradients.dark.main, 0.6),
            rgba(gradients.dark.state, 0.6)
          )}, url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex", // Make it a flex container
        flexDirection: "column", // Stack items vertically
        alignItems: "center",
        justifyContent: "flex-start", // Start content from top
        paddingTop: "64px", // Adjust if you have a fixed navbar
        position: "relative", // Needed for absolute positioning of navbar if it's there
      }}
    >
      {/* Example Navbar integration - adjust if your template uses a different Navbar */}
      {/* You might want to remove this if your authentication pages don't have a navbar */}
      {/* <MDBox position="absolute" top="0" left="0" width="100%">
        <DefaultNavbar
          routes={navbarRoutes}
          action={{ type: "internal", route: "/dashboard", label: "dashboard", color: "white" }}
          light={true} // Pass `light` prop here if DefaultNavbarLink requires it
        />
      </MDBox> */}

      <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
        <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
          {/* THIS IS THE CRUCIAL PART: Rendering the children */}
          {children}
        </Grid>
      </Grid>
    </MDBox>
  );
}

CoverLayout.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;
