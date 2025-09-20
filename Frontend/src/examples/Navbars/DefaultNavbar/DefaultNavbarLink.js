// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function DefaultNavbarLink({ icon, name, route, light }) {
  // 'light' is correctly destructured
  return (
    <MDBox
      component={Link}
      to={route}
      mx={1}
      p={1}
      display="flex"
      alignItems="center"
      sx={{ cursor: "pointer", userSelect: "none" }}
    >
      <Icon
        sx={{
          color: ({ palette: { white, secondary } }) => (light ? white.main : secondary.main),
          verticalAlign: "middle",
        }}
      >
        {icon}
      </Icon>
      <MDTypography
        variant="button"
        fontWeight="regular"
        color={light ? "white" : "dark"}
        textTransform="capitalize"
        sx={{ width: "100%", lineHeight: 0 }}
      >
        &nbsp;{name}
      </MDTypography>
    </MDBox>
  );
}

// Setting default values for the props of DefaultNavbarLink
DefaultNavbarLink.defaultProps = {
  light: false, // Set a default value, as it's no longer required
};

// Typechecking props for the DefaultNavbarLink
DefaultNavbarLink.propTypes = {
  icon: PropTypes.node.isRequired, // Changed from string to node, as icons can be components
  name: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  light: PropTypes.bool, // Changed from isRequired to optional bool
};

export default DefaultNavbarLink;
