import Dashboard from "layouts/dashboard"; // <--- ENSURE THIS LINE IS PRESENT AND UNCOMMENTED
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import CreateItem from "layouts/items/create";
import EditItem from "layouts/items/edit";
import NotificationsPage from "layouts/notifications"; // <--- renamed Notifications to NotificationsPage to avoid conflict if you have a state variable named Notifications

// @mui icons
import Icon from "@mui/material/Icon";

// Auth Context
import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

// --- PrivateRoute Component ---
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/authentication/sign-in" />;
};
PrivateRoute.propTypes = { children: PropTypes.node.isRequired };

const getRoutes = (isAuthenticated, logout) => {
  const baseRoutes = [
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: "/dashboard",
      component: (
        <PrivateRoute>
          <Dashboard /> {/* <--- Dashboard is used here */}
        </PrivateRoute>
      ),
    },
    {
      type: "collapse",
      name: "Tables",
      key: "tables",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/tables",
      component: (
        <PrivateRoute>
          <Tables />
        </PrivateRoute>
      ),
    },
    {
      type: "route",
      name: "Create Item",
      key: "create-item",
      icon: <Icon fontSize="small">add</Icon>,
      route: "/items/create",
      component: (
        <PrivateRoute>
          <CreateItem />
        </PrivateRoute>
      ),
      noCollapse: true,
    },
    {
      type: "route",
      name: "Edit Item",
      key: "edit-item",
      icon: <Icon fontSize="small">edit</Icon>,
      route: "/items/edit/:item_id",
      component: (
        <PrivateRoute>
          <EditItem />
        </PrivateRoute>
      ),
      noCollapse: true,
    },
    {
      type: "collapse",
      name: "Notifications",
      key: "notifications",
      icon: <Icon fontSize="small">notifications</Icon>,
      route: "/notifications",
      component: (
        <PrivateRoute>
          <NotificationsPage /> {/* <--- Use NotificationsPage here */}
        </PrivateRoute>
      ),
    },
    // ... remaining original routes (Billing, RTL, Profile) ...
    {
      type: "collapse",
      name: "Billing",
      key: "billing",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/billing",
      component: (
        <PrivateRoute>
          <Billing />
        </PrivateRoute>
      ),
    },
    {
      type: "collapse",
      name: "RTL",
      key: "rtl",
      icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
      route: "/rtl",
      component: (
        <PrivateRoute>
          <RTL />
        </PrivateRoute>
      ),
    },
    {
      type: "collapse",
      name: "Profile",
      key: "profile",
      icon: <Icon fontSize="small">person</Icon>,
      route: "/profile",
      component: (
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      ),
    },
  ];

  let authRoutes = [];
  if (isAuthenticated) {
    authRoutes.push({
      type: "collapse",
      name: "Log Out",
      key: "logout",
      icon: <Icon fontSize="small">logout</Icon>,
      route: "/authentication/sign-in",
      component: <SignIn />,
      noCollapse: true,
    });
  } else {
    authRoutes.push(
      {
        type: "collapse",
        name: "Sign In",
        key: "sign-in",
        icon: <Icon fontSize="small">login</Icon>,
        route: "/authentication/sign-in",
        component: <SignIn />,
      },
      {
        type: "collapse",
        name: "Sign Up",
        key: "sign-up",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/authentication/sign-up",
        component: <SignUp />,
      }
    );
  }

  const allRoutes = [...baseRoutes, ...authRoutes];

  // REDIRECTION ROUTES
  allRoutes.push(
    {
      type: "redirect",
      route: "/",
      component: isAuthenticated ? (
        <Navigate to="/dashboard" />
      ) : (
        <Navigate to="/authentication/sign-in" />
      ),
      key: "root-redirect",
    },
    {
      type: "redirect",
      route: "/authentication",
      component: isAuthenticated ? (
        <Navigate to="/dashboard" />
      ) : (
        <Navigate to="/authentication/sign-in" />
      ),
      key: "auth-redirect",
    }
  );

  return allRoutes;
};

export default getRoutes;
