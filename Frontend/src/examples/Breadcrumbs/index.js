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
  const pathnames = route.split("/").filter((x) => x); // Splits the path string into an array of segments

  const breadcrumbItems = pathnames.map((name, index) => {
    const last = index === pathnames.length - 1;
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;

    // REMOVED: Conditional rendering of title in the map
    // We will just render the icon for home, and skip the specific title for the current page
    return (
      <Link to={to} key={name}>
        <MDTypography
          component="span"
          variant="body2"
          color={light ? "white" : "dark"}
          opacity={light ? 0.8 : 0.5}
          sx={{ lineHeight: 0 }}
        >
          {/* We're now rendering all segments as links except possibly the last one */}
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
        {/* --- REMOVED: Dynamic breadcrumb items, if you only want the icon --- */}
        {/* {breadcrumbItems} */}

        {/* --- If you only want the CURRENT page title as a single item, and not the trail --- */}
        {/* You said "Dashboard" text should not come. So we can conditionally render it. */}
        {title && ( // Only render if title exists and is not empty
          <MDTypography
            variant="body2"
            color={light ? "white" : "dark"}
            fontWeight="regular"
            sx={{ lineHeight: 0 }}
          >
            {title}
          </MDTypography>
        )}
      </MuiBreadcrumbs>
    </MDBox>
  );
}

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  light: PropTypes.bool,
};

// Default props for Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
};

export default Breadcrumbs;
