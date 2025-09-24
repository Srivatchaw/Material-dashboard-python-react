/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import { Link } from "react-router-dom";

// @mui material components
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Declaring prop types for Breadcrumbs
import PropTypes from "prop-types";

function Breadcrumbs({ icon, title, route, light }) {
  // 'route' is expected as a string like "/dashboard/tables"
  const pathnames = route.split("/").filter((x) => x); // Splits the path string into an array of segments (e.g., ["dashboard", "tables"])

  const breadcrumbItems = pathnames.map((name, index) => {
    const last = index === pathnames.length - 1;
    const to = `/${pathnames.slice(0, index + 1).join("/")}`; // Constructs the path for each breadcrumb item

    return last ? ( // If it's the last item, render as plain text (current page)
      <MDTypography
        key={name} // Use name as key for uniqueness within the map
        variant="body2"
        color={light ? "white" : "dark"}
        fontWeight="regular"
        sx={{ lineHeight: 0 }}
      >
        {title || name.charAt(0).toUpperCase() + name.slice(1)}{" "}
        {/* Display title, or capitalize name */}
      </MDTypography>
    ) : (
      // Otherwise, render as a clickable link
      <Link to={to} key={name}>
        <MDTypography
          component="span"
          variant="body2"
          color={light ? "white" : "dark"}
          opacity={light ? 0.8 : 0.5}
          sx={{ lineHeight: 0 }}
        >
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </MDTypography>
      </Link>
    );
  });

  return (
    <MDBox mr={{ xs: 0, xl: 8 }}>
      <MuiBreadcrumbs sx={{ "& .MuiBreadcrumbs-separator": { color: light ? "white" : "dark" } }}>
        {/* Home Link (always present) */}
        <Link to="/">
          <MDTypography
            component="span"
            variant="body2"
            color={light ? "white" : "dark"}
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0 }}
          >
            <Icon>{icon}</Icon> {/* Display the icon (e.g., 'home') */}
          </MDTypography>
        </Link>
        {breadcrumbItems} {/* Render the dynamically generated breadcrumb items */}
      </MuiBreadcrumbs>
    </MDBox>
  );
}

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired, // <--- CONFIRMED: route is a string (current path)
  light: PropTypes.bool,
};

// Default props for Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
};

export default Breadcrumbs;
